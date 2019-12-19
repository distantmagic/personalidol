// @flow

import * as THREE from "three";

import CanvasView from "../CanvasView";
import disposeObject3D from "../../helpers/disposeObject3D";
import QuakeBrushGeometryBuilder from "../QuakeBrushGeometryBuilder";
import QuakeMapTextureLoader from "../QuakeMapTextureLoader";

import type { Group, LoadingManager as THREELoadingManager, Mesh } from "three";

// those are a few hacks, but in the end it's possible to load web workers
// with create-react-app without ejecting
/* eslint-disable import/no-webpack-loader-syntax */
// $FlowFixMe
// import QuakeBrushGeometryBuilderWorker from "workerize-loader?inline!../QuakeBrushGeometryBuilder.worker";
/* eslint-enable import/no-webpack-loader-syntax */

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QuakeEntity } from "../../interfaces/QuakeEntity";
import type { QuakeMapTextureLoader as QuakeMapTextureLoaderInterface } from "../../interfaces/QuakeMapTextureLoader";
import type { QueryBus } from "../../interfaces/QueryBus";

const shaderDefines = `
  #define PHONG
  #define USE_UV
`;

const vertexShader = `
  ${shaderDefines}

  varying vec3 vViewPosition;

  #ifndef FLAT_SHADED

    varying vec3 vNormal;

  #endif

  ${THREE.ShaderChunk.common}
  ${THREE.ShaderChunk.uv_pars_vertex}
  ${THREE.ShaderChunk.shadowmap_pars_vertex}

  attribute float a_textureIndex;
  varying float v_textureIndex;

  void main() {
    // replace "uv_vertex" with this to skip transforms
    vUv = uv;
    v_textureIndex = a_textureIndex;


    ${THREE.ShaderChunk.beginnormal_vertex}
    ${THREE.ShaderChunk.defaultnormal_vertex}

    #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

      vNormal = normalize( transformedNormal );

    #endif

    ${THREE.ShaderChunk.begin_vertex}
    ${THREE.ShaderChunk.project_vertex}

    vViewPosition = - mvPosition.xyz;

    ${THREE.ShaderChunk.worldpos_vertex}
    ${THREE.ShaderChunk.shadowmap_vertex}
  }
`;

const fragmentShader = `
  ${shaderDefines}

  // THREE Uniforms
  uniform vec3 diffuse;
  uniform vec3 emissive;
  uniform vec3 specular;
  uniform float shininess;
  uniform float opacity;

  // Custom variables
  uniform sampler2D u_textures[NUM_TEXTURES];
  varying float v_textureIndex;

  ${THREE.ShaderChunk.common}
  ${THREE.ShaderChunk.packing}
  ${THREE.ShaderChunk.uv_pars_fragment}
  ${THREE.ShaderChunk.bsdfs}
  ${THREE.ShaderChunk.lights_pars_begin}
  ${THREE.ShaderChunk.lights_phong_pars_fragment}
  ${THREE.ShaderChunk.shadowmap_pars_fragment}

  vec4 sample_texture(int textureIndex) {
    // Clumsy for loop here is to overcome some WebGL shader limitations
    // Also, int attributes are not supported in WebGL, so I had to cast
    // float to int to use array indexes.
    for (int i = 0; i < NUM_TEXTURES; i += 1) {
      if (i == textureIndex) {
        return texture2D( u_textures[i], vUv );
      }
    }

    return vec4( 1.0, 0.0, 0.0, 1.0 );
  }

  void main() {
    vec4 diffuseColor = vec4( diffuse, opacity );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    vec3 totalEmissiveRadiance = emissive;

    // replace 'map_fragment' with multi-texture sampling
    vec4 texelColor = sample_texture( int( v_textureIndex ) );

    texelColor = mapTexelToLinear( texelColor );
    diffuseColor *= texelColor;

    ${THREE.ShaderChunk.specularmap_fragment}
    ${THREE.ShaderChunk.normal_fragment_begin}

    // accumulation
    ${THREE.ShaderChunk.lights_phong_fragment}
    ${THREE.ShaderChunk.lights_fragment_begin}
    ${THREE.ShaderChunk.lights_fragment_end}

    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

    gl_FragColor = vec4( outgoingLight, diffuseColor.a );

    ${THREE.ShaderChunk.tonemapping_fragment}
    ${THREE.ShaderChunk.encodings_fragment}
  }
`;

export default class QuakeBrush extends CanvasView {
  +entity: QuakeEntity;
  +group: Group;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +textureLoader: QuakeMapTextureLoaderInterface;
  +threeLoadingManager: THREELoadingManager;
  mesh: ?Mesh;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, entity: QuakeEntity, group: Group, queryBus: QueryBus, threeLoadingManager: THREELoadingManager) {
    super(canvasViewBag);

    this.entity = entity;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.mesh = null;
    this.group = group;

    this.textureLoader = new QuakeMapTextureLoader(loggerBreadcrumbs.add("QuakeMapTextureLoader"), threeLoadingManager, queryBus);
    this.textureLoader.registerTexture("__TB_empty", "/debug/texture-uv-1024x1024.png");
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    // console.time("BRUSH");
    for (let brush of this.entity.getBrushes()) {
      for (let texture of brush.getTextures()) {
        if ("__TB_empty" !== texture) {
          this.textureLoader.registerTexture(texture, `${texture}.png`);
        }
      }
    }

    const loadedTextures = await this.textureLoader.loadRegisteredTextures(cancelToken);
    const quakeBrushGeometryBuilder = new QuakeBrushGeometryBuilder(this.textureLoader);

    for (let brush of this.entity.getBrushes()) {
      quakeBrushGeometryBuilder.addBrush(brush, loadedTextures);
    }
    // console.timeEnd("BRUSH");

    const mesh = new THREE.Mesh(
      quakeBrushGeometryBuilder.getGeometry(),
      new THREE.ShaderMaterial({
        lights: true,

        defines: {
          NUM_TEXTURES: String(loadedTextures.length),
        },

        fragmentShader: fragmentShader,

        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.common,
          THREE.UniformsLib.lights,
          {
            emissive: new THREE.Uniform(new THREE.Color(0x000000)),
            specular: new THREE.Uniform(new THREE.Color(0x111111)),
            shininess: new THREE.Uniform(3),
            u_textures: new THREE.Uniform(loadedTextures),
          },
        ]),

        vertexShader: vertexShader,
      })
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.mesh = mesh;
    this.group.add(mesh);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const mesh = this.mesh;

    if (!mesh) {
      return;
    }

    disposeObject3D(mesh, false);
    this.textureLoader.dispose();
    this.group.remove(mesh);
  }
}
