// @flow

import * as THREE from "three";
import range from "lodash/range";

import CanvasView from "../CanvasView";
import QuakeMapTextureLoader from "../QuakeMapTextureLoader";

import type { BufferGeometry, Group, LoadingManager as THREELoadingManager, Mesh, ShaderMaterial, Texture } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QuakeMapTextureLoader as QuakeMapTextureLoaderInterface } from "../../interfaces/QuakeMapTextureLoader";
import type { QueryBus } from "../../interfaces/QueryBus";

type WorkerQuakeBrush = {|
  +classname: "worldspawn",
  +indices: ArrayBuffer,
  +normals: ArrayBuffer,
  +texturesIndices: ArrayBuffer,
  +texturesNames: $ReadOnlyArray<string>,
  +uvs: ArrayBuffer,
  +vertices: ArrayBuffer,
|};

const vertexShader = `
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
    ${THREE.ShaderChunk.uv_vertex}

    // use custom 'a_textureIndex' buffer geometry parameter to select
    // appropriate texture in fragment shader
    v_textureIndex = a_textureIndex + 0.5;

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

export default class QuakeBrush extends CanvasView {
  +entity: WorkerQuakeBrush;
  +group: Group;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +textureLoader: QuakeMapTextureLoaderInterface;
  +threeLoadingManager: THREELoadingManager;
  mesh: ?Mesh<BufferGeometry, ShaderMaterial>;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    canvasViewBag: CanvasViewBag,
    entity: WorkerQuakeBrush,
    group: Group,
    queryBus: QueryBus,
    threeLoadingManager: THREELoadingManager
  ) {
    super(canvasViewBag);

    this.entity = entity;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.group = group;

    this.textureLoader = new QuakeMapTextureLoader(loggerBreadcrumbs.add("QuakeMapTextureLoader"), threeLoadingManager, queryBus);
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const normals = new Float32Array(this.entity.normals);
    const texturesIndices = new Float32Array(this.entity.texturesIndices);
    const uvs = new Float32Array(this.entity.uvs);
    const vertices = new Float32Array(this.entity.vertices);

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setAttribute("a_textureIndex", new THREE.BufferAttribute(texturesIndices, 1));

    for (let texture of this.entity.texturesNames) {
      if ("__TB_empty" === texture) {
        this.textureLoader.registerTexture("__TB_empty", "/debug/texture-uv-1024x1024.png");
      } else {
        this.textureLoader.registerTexture(texture, `${texture}.png`);
      }
    }

    const loadedTextures = await this.textureLoader.loadRegisteredTextures(cancelToken);

    const material = this.getMaterial(loadedTextures);
    const mesh = new THREE.Mesh(geometry, material);

    // TODO ios material behaves like if 'castShadow' if 'false'
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.children.add(mesh);
    this.group.add(this.children);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.group.remove(this.children);
    this.textureLoader.dispose();
  }

  getMaterial(loadedTextures: $ReadOnlyArray<Texture>): Material {
    const fragmentShader = `
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

      void main() {
        // phong shader chunk
        vec4 diffuseColor = vec4( diffuse, opacity );
        ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
        vec3 totalEmissiveRadiance = emissive;

        // replace 'map_fragment' with multi-texture sampling
        ${range(loadedTextures.length)
          .map(
            (index: number) => `
          if ( v_textureIndex < ${index}.9 ) {
            diffuseColor = mapTexelToLinear( texture2D( u_textures[ ${index} ], vUv ) );
          }
        `
          )
          .join(" else ")}

        ${THREE.ShaderChunk.specularmap_fragment}
        ${THREE.ShaderChunk.normal_fragment_begin}
        ${THREE.ShaderChunk.lights_phong_fragment}
        ${THREE.ShaderChunk.lights_fragment_begin}
        ${THREE.ShaderChunk.lights_fragment_end}

        // phong shader chunk
        vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
        gl_FragColor = vec4( outgoingLight, diffuseColor.a );

        ${THREE.ShaderChunk.tonemapping_fragment}
        ${THREE.ShaderChunk.encodings_fragment}
      }
    `;

    return new THREE.ShaderMaterial({
      lights: true,

      defines: {
        NUM_TEXTURES: String(loadedTextures.length),
        PHONG: "",
        USE_UV: "",
      },

      fragmentShader: fragmentShader,

      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib.phong.uniforms,
        {
          shininess: new THREE.Uniform(1),
          u_textures: new THREE.Uniform(loadedTextures),
        },
      ]),

      vertexShader: vertexShader,
    });
  }
}
