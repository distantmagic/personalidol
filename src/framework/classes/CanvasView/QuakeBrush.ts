import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";
import QuakeMapTextureLoader from "src/framework/classes/QuakeMapTextureLoader";
import { default as QuakeMapException } from "src/framework/classes/Exception/QuakeMap";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import QueryBus from "src/framework/interfaces/QueryBus";
import { default as IQuakeMapTextureLoader } from "src/framework/interfaces/QuakeMapTextureLoader";

import QuakeWorkerBrush from "src/framework/types/QuakeWorkerBrush";

const TEXTURE_SIZE = 128;

const fragmentShader = `
  // THREE Uniforms
  uniform vec3 diffuse;
  uniform vec3 emissive;
  uniform vec3 specular;
  uniform float shininess;
  uniform float opacity;

  // Custom variables
  uniform sampler2D u_texture_atlas;
  uniform float u_texture_count;
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
    float textureWidth = 1.0 / u_texture_count;
    vec2 atlas_uv = vec2(
      mod( vUv.x, textureWidth ),
      mod( vUv.y, textureWidth ) + v_textureIndex * textureWidth
    );

    diffuseColor = texture2D( u_texture_atlas, atlas_uv );

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

const vertexShader = `
  varying vec3 vViewPosition;

  #ifndef FLAT_SHADED
    varying vec3 vNormal;
  #endif

  ${THREE.ShaderChunk.common}
  ${THREE.ShaderChunk.uv_pars_vertex}
  ${THREE.ShaderChunk.shadowmap_pars_vertex}

  // Custom variables
  attribute float texture_index;
  uniform float u_texture_count;
  varying float v_textureIndex;

  void main() {
    // use custom 'texture_index' buffer geometry parameter to select
    // appropriate texture in fragment shader
    v_textureIndex = texture_index;

    vUv = vec2(
      uv.x / 8.0,
      uv.y / 8.0
    );

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

function getMaterial(textureAtlas: THREE.Texture, textureCount: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    lights: true,

    defines: {
      PHONG: "",
      USE_SHADOWMAP: "",
      USE_UV: "",
    },

    fragmentShader: fragmentShader,

    uniforms: THREE.UniformsUtils.merge([
      THREE.ShaderLib.phong.uniforms,
      {
        shininess: new THREE.Uniform(1),
        u_texture_atlas: new THREE.Uniform(textureAtlas),
        u_texture_count: new THREE.Uniform(textureCount),
      },
    ]),

    vertexShader: vertexShader,
  });
}

export default class QuakeBrush extends CanvasView {
  private mesh: null | THREE.Mesh = null;
  private textureAtlas: null | THREE.DataTexture = null;
  readonly entity: QuakeWorkerBrush;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly textureLoader: IQuakeMapTextureLoader;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    canvasViewBag: CanvasViewBag,
    group: THREE.Group,
    entity: QuakeWorkerBrush,
    queryBus: QueryBus,
    threeLoadingManager: THREE.LoadingManager
  ) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    this.entity = entity;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.textureLoader = new QuakeMapTextureLoader(loggerBreadcrumbs.add("QuakeMapTextureLoader"), threeLoadingManager, queryBus);
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const indices = new Uint32Array(this.entity.indices);
    const normals = new Float32Array(this.entity.normals);
    const texturesIndices = new Float32Array(this.entity.texturesIndices);
    const uvs = new Float32Array(this.entity.uvs);
    const vertices = new Float32Array(this.entity.vertices);
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute("texture_index", new THREE.BufferAttribute(texturesIndices, 1));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    for (let texture of this.entity.texturesNames) {
      if ("__TB_empty" === texture) {
        this.textureLoader.registerTexture("__TB_empty", "/debug/texture-uv-1024x1024.png");
      } else {
        this.textureLoader.registerTexture(texture, `${texture}.png`);
      }
    }

    const loadedTextures = await this.textureLoader.loadRegisteredTextures(cancelToken);
    const textureAtlasHeight = loadedTextures.length * TEXTURE_SIZE;
    const atlasCanvas: HTMLCanvasElement = document.createElement("canvas");

    atlasCanvas.height = textureAtlasHeight;
    atlasCanvas.width = TEXTURE_SIZE;

    const atlasCanvasContext = atlasCanvas.getContext("2d");

    if (!atlasCanvasContext) {
      throw new QuakeMapException(this.loggerBreadcrumbs.add("attach"), "Unable to create canvas 2D context.");
    }

    for (let i = 0; i < loadedTextures.length; i += 1) {
      atlasCanvasContext.drawImage(loadedTextures[i].image, 0, i * TEXTURE_SIZE, TEXTURE_SIZE, TEXTURE_SIZE);
      loadedTextures[i].dispose();
    }

    // make texture atlas size a power of two because of performance reasons
    const textureAtlasSide = THREE.Math.ceilPowerOfTwo(textureAtlasHeight);
    const imageData = atlasCanvasContext.getImageData(0, 0, textureAtlasSide, textureAtlasSide);

    // iOS/Safari: conversion fixes ArrayBuffer is not Uint8Array
    const textureData = Uint8Array.from(imageData.data);

    const textureAtlas = new THREE.DataTexture(textureData, textureAtlasSide, textureAtlasSide);

    this.textureAtlas = textureAtlas;

    textureAtlas.wrapS = textureAtlas.wrapT = THREE.RepeatWrapping;

    const material = getMaterial(textureAtlas, loadedTextures.length);
    const mesh = new THREE.Mesh(geometry, material);

    this.mesh = mesh;

    // TODO ios material behaves like if 'castShadow' if 'false'
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.children.add(mesh);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.textureLoader.dispose();

    const textureAtlas = this.textureAtlas;

    if (textureAtlas) {
      textureAtlas.dispose();
    }
  }

  getName(): "QuakeBrush" {
    return "QuakeBrush";
  }
}
