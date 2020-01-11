// @flow strict

import * as THREE from "three";

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
  +texturesNames: Array<string>,
  +uvs: ArrayBuffer,
  +vertices: ArrayBuffer,
|};

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

function getMaterial(textureAtlas: Texture, textureCount: number): ShaderMaterial {
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
  +entity: WorkerQuakeBrush;
  +group: Group;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +textureLoader: QuakeMapTextureLoaderInterface;
  +threeLoadingManager: THREELoadingManager;
  mesh: ?Mesh<BufferGeometry, ShaderMaterial>;

  static shaderMaterial: ?ShaderMaterial;

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

    for (let i = 0; i < loadedTextures.length; i += 1) {
      atlasCanvasContext.drawImage(loadedTextures[i].image, 0, i * TEXTURE_SIZE, TEXTURE_SIZE, TEXTURE_SIZE);
    }

    // make texture atlas size a power of two because of performance reasons
    const textureAtlasSide = THREE.Math.ceilPowerOfTwo(textureAtlasHeight);

    // iOS/Safari: conversion fixes ArrayBuffer is not Uint8Array
    const textureData = Uint8Array.from(atlasCanvasContext.getImageData(0, 0, textureAtlasSide, textureAtlasSide).data);

    const textureAtlas = new THREE.DataTexture(textureData, textureAtlasSide, textureAtlasSide);

    textureAtlas.wrapS = textureAtlas.wrapT = THREE.RepeatWrapping;

    const material = getMaterial(textureAtlas, loadedTextures.length);
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
}
