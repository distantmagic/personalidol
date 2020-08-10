import { AmbientLight } from "three/src/lights/AmbientLight";
import { BufferAttribute } from "three/src/core/BufferAttribute";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { Color } from "three/src/math/Color";
import { Fog } from "three/src/scenes/Fog";
import { FrontSide } from "three/src/constants";
import { HemisphereLight } from "three/src/lights/HemisphereLight";
import { MathUtils } from "three/src/math/MathUtils";
import { Mesh } from "three/src/objects/Mesh";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { PointLight } from "three/src/lights/PointLight";
import { Scene } from "three/src/scenes/Scene";
import { SpotLight } from "three/src/lights/SpotLight";
import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { createRPCLookupTable } from "@personalidol/workers/src/createRPCLookupTable";
import { createTextureReceiverMessagesRouter } from "@personalidol/texture-loader/src/createTextureReceiverMessagesRouter";
import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { disposableMaterial } from "@personalidol/framework/src/disposableMaterial";
import { getPrimaryPointerVectorX } from "@personalidol/framework/src/getPrimaryPointerVectorX";
import { getPrimaryPointerVectorY } from "@personalidol/framework/src/getPrimaryPointerVectorY";
import { handleRPCResponse } from "@personalidol/workers/src/handleRPCResponse";
import { imageDataBufferResponseToTexture } from "@personalidol/texture-loader/src/imageDataBufferResponseToTexture";
import { invoke } from "@personalidol/framework/src/invoke";
import { isPrimaryPointerPressed } from "@personalidol/framework/src/isPrimaryPointerPressed";
import { notifyLoadingManager } from "@personalidol/framework/src/notifyLoadingManager";
import { requestTexture } from "@personalidol/texture-loader/src/requestTexture";
import { resetLoadingManagerState } from "@personalidol/framework/src/resetLoadingManagerState";
import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";

import type { Logger } from "loglevel";
import type { Texture as ITexture } from "three";

import type { DirectorState } from "@personalidol/framework/src/DirectorState.type";
import type { Disposable } from "@personalidol/framework/src/Disposable.type";
import type { EntityFuncGroup } from "@personalidol/quakemaps/src/EntityFuncGroup.type";
import type { EntityGLTFModel } from "@personalidol/quakemaps/src/EntityGLTFModel.type";
import type { EntityLightAmbient } from "@personalidol/quakemaps/src/EntityLightAmbient.type";
import type { EntityLightHemisphere } from "@personalidol/quakemaps/src/EntityLightHemisphere.type";
import type { EntityLightPoint } from "@personalidol/quakemaps/src/EntityLightPoint.type";
import type { EntityLightSpotlight } from "@personalidol/quakemaps/src/EntityLightSpotlight.type";
import type { EntityLookup } from "@personalidol/quakemaps/src/EntityLookup.type";
import type { EntityMD2Model } from "@personalidol/quakemaps/src/EntityMD2Model.type";
import type { EntityPlayer } from "@personalidol/quakemaps/src/EntityPlayer.type";
import type { EntitySounds } from "@personalidol/quakemaps/src/EntitySounds.type";
import type { EntitySparkParticles } from "@personalidol/quakemaps/src/EntitySparkParticles.type";
import type { EntityWorldspawn } from "@personalidol/quakemaps/src/EntityWorldspawn.type";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { LoadingManagerState } from "@personalidol/framework/src/LoadingManagerState.type";
import type { RendererState } from "@personalidol/framework/src/RendererState.type";
import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";
import type { Scene as IScene } from "@personalidol/framework/src/Scene.interface";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";
import type { Unmountable } from "@personalidol/framework/src/Unmountable.type";

import type { EntityLookupCallback } from "./EntityLookupCallback.type";
import type { EntityLookupTable } from "./EntityLookupTable.type";

const CAMERA_ZOOM_MAX = 200;
const CAMERA_ZOOM_MIN = 1400;

const _camera = new PerspectiveCamera();

_camera.far = 3000;
_camera.near = 1;

const _cameraDirection = new Vector3();
const _disposables: Set<Disposable> = new Set();
const _playerPosition = new Vector3();
const _pointerVector = new Vector2(0, 0);
const _pointerVectorRotationPivot = new Vector2(0, 0);
const _scene = new Scene();

_scene.background = new Color(0x000000);
_scene.fog = new Fog(_scene.background, _camera.far - 1000, _camera.far);

const _unmountables: Set<Unmountable> = new Set();

const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();
const _atlasMessageRouter = createRouter({
  textureAtlas: handleRPCResponse(_rpcLookupTable),
});
const _md2MessageRouter = createRouter({
  geometry: handleRPCResponse(_rpcLookupTable),
});
const _quakeMapsRouter = createRouter({
  map: handleRPCResponse(_rpcLookupTable),
});
const _textureReceiverMessageRouter = createTextureReceiverMessagesRouter(_rpcLookupTable);

const _clearRendererMessage = {
  render: {
    route: null,
  },
};

let _cameraZoomAmount = 0;

export function MapScene(
  logger: Logger,
  directorState: DirectorState,
  eventBus: EventBus,
  inputState: Int16Array,
  atlasMessagePort: MessagePort,
  domMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  loadingManagerState: LoadingManagerState,
  rendererState: RendererState,
  mapFilename: string
): IScene {
  const state: SceneState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  _camera.position.set(100, 100, 100);
  _camera.lookAt(0, 0, 0);
  _camera.getWorldDirection(_cameraDirection);

  const entityLookupTable: EntityLookupTable = {
    func_group(entity: EntityFuncGroup): void {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    light_ambient(entity: EntityLightAmbient): void {
      const ambientLight = new AmbientLight(0xffffff, entity.light);

      _scene.add(ambientLight);

      _unmountables.add(function () {
        _scene.remove(ambientLight);
      });
    },

    light_hemisphere(entity: EntityLightHemisphere): void {
      const hemisphereLight = new HemisphereLight(0xffffbb, 0x080820, entity.light);

      _scene.add(hemisphereLight);

      _unmountables.add(function () {
        _scene.remove(hemisphereLight);
      });
    },

    light_point(entity: EntityLightPoint): void {
      const color = new Color(parseInt(entity.color, 16));
      const pointLight = new PointLight(color, entity.intensity, 512);

      pointLight.position.set(entity.origin.x, entity.origin.y, entity.origin.z);
      pointLight.decay = entity.decay;
      // pointLight.castShadow = true;
      pointLight.shadow.camera.far = 512;

      _scene.add(pointLight);

      _unmountables.add(function () {
        _scene.remove(pointLight);
      });
    },

    light_spotlight(entity: EntityLightSpotlight): void {
      const color = new Color(parseInt(entity.color, 16));
      const spotLight = new SpotLight(color, entity.intensity);

      spotLight.position.set(entity.origin.x, entity.origin.y, entity.origin.z);
      spotLight.target.position.set(entity.origin.x, 0, entity.origin.z);
      spotLight.decay = entity.decay;
      spotLight.distance = 512;
      spotLight.penumbra = 1;
      spotLight.castShadow = true;
      spotLight.visible = true;
      spotLight.shadow.camera.far = 512;

      _scene.add(spotLight);
      _unmountables.add(function () {
        _scene.remove(spotLight);
      });
    },

    async model_gltf(entity: EntityGLTFModel): Promise<void> {
      console.log(entity);
      return;
      // const model = await loaders.gltf.loadAsync(`/models/model-glb-${entity.model_name}/model.glb`);
      // const mesh = model.scene.children[0] as Mesh;

      // mesh.position.set(entity.origin.x, entity.origin.y, entity.origin.z);

      // _scene.add(mesh);

      // _disposables.add(disposableGeneric(mesh.geometry));
      // _disposables.add(disposableMaterial(mesh.material));

      // _unmountables.add(function () {
      //   _scene.remove(mesh);
      // });
    },

    async model_md2(entity: EntityMD2Model): Promise<void> {
      const loadItemModelMD2 = {
        comment: `model ${entity.model_name}`,
        weight: 2,
      };

      const modelRequest = sendRPCMessage(_rpcLookupTable, md2MessagePort, {
        load: {
          model_name: entity.model_name,
          rpc: MathUtils.generateUUID(),
        },
      });

      const { load: geometry } = await notifyLoadingManager(loadingManagerState, loadItemModelMD2, modelRequest);

      const textureUrl = `/models/model-md2-${entity.model_name}/skins/${geometry.parts.skins[entity.skin]}`;

      const bufferGeometry = new BufferGeometry();

      bufferGeometry.setAttribute("normal", new BufferAttribute(geometry.normals, 3));
      bufferGeometry.setAttribute("position", new BufferAttribute(geometry.vertices, 3));
      bufferGeometry.setAttribute("uv", new BufferAttribute(geometry.uvs, 2));

      const material = new MeshBasicMaterial({
        color: 0xcccccc,
        flatShading: true,
        map: await _loadTexture(textureUrl),
      });
      const mesh = new Mesh(bufferGeometry, material);

      // mesh.castShadow = true;
      mesh.position.set(entity.origin.x, entity.origin.y, entity.origin.z);

      _scene.add(mesh);

      _disposables.add(disposableGeneric(bufferGeometry));
      _disposables.add(disposableMaterial(material));

      _unmountables.add(function () {
        _scene.remove(mesh);
      });
    },

    player(entity: EntityPlayer): void {
      _playerPosition.set(entity.origin.x, entity.origin.y, entity.origin.z);
      _onCameraUpdate();
    },

    sounds(entity: EntitySounds): void {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    spark_particles(entity: EntitySparkParticles): void {
      // throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    async worldspawn(entity: EntityWorldspawn): Promise<void> {
      logger.debug("MAP VERTICES", entity.vertices.length / 3);

      const bufferGeometry = new BufferGeometry();

      bufferGeometry.setAttribute("normal", new BufferAttribute(entity.normals, 3));
      bufferGeometry.setAttribute("position", new BufferAttribute(entity.vertices, 3));
      // bufferGeometry.setAttribute("texture_index", new BufferAttribute(entity.textures, 1));
      bufferGeometry.setAttribute("uv", new BufferAttribute(entity.uvs, 2));
      bufferGeometry.setIndex(new BufferAttribute(entity.indices, 1));

      const textureAtlasRequest = sendRPCMessage(_rpcLookupTable, atlasMessagePort, {
        createTextureAtlas: {
          textureUrls: entity.textureNames.map(_createTextureUrl),
          rpc: MathUtils.generateUUID(),
        },
      });

      const _loadItemTextureAtlas = {
        comment: "textures",
        weight: 1,
      };

      const { createTextureAtlas: textureAtlas } = await notifyLoadingManager(loadingManagerState, _loadItemTextureAtlas, textureAtlasRequest);

      console.log(textureAtlas);

      const meshStandardMaterial = new MeshStandardMaterial({
        flatShading: true,
        map: imageDataBufferResponseToTexture(textureAtlas),
        side: FrontSide,
      });

      console.log(entity.textureNames);

      // meshStandardMaterial.onBeforeCompile = function (shader, renderer) {
      //   // Texture atlas is used here, so texture sampling fragment needs to
      //   // be changed.
      //   shader.fragmentShader = shader.fragmentShader.replace(
      //     "#include <map_fragment>",
      //     `
      //       #ifdef USE_MAP

      //         // vec4 texelColor = texture2D( map, vUv );
      //         vec4 texelColor = vec4( 1.0, 1.0, 1.0, 1.0 );

      //         texelColor = mapTexelToLinear( texelColor );
      //         diffuseColor *= texelColor;

      //       #endif
      //     `
      //   );
      // };

      const mesh = new Mesh(bufferGeometry, meshStandardMaterial);

      mesh.castShadow = mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;

      _scene.add(mesh);
      _unmountables.add(function () {
        _scene.remove(mesh);
      });
      _disposables.add(disposableGeneric(bufferGeometry));
      _disposables.add(disposableMaterial(meshStandardMaterial));
    },
  };

  function dispose(): void {
    state.isDisposed = true;

    _disposables.forEach(invoke);
    _disposables.clear();
  }

  function mount(): void {
    state.isMounted = true;

    eventBus.POINTER_ZOOM_REQUEST.add(_onPointerZoomRequest);

    rendererState.camera = _camera;
    rendererState.scene = _scene;

    _cameraZoomAmount = 400;
    _onCameraUpdate();

    _unmountables.add(_unmountFromRenderer);
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    atlasMessagePort.onmessage = _atlasMessageRouter;
    md2MessagePort.onmessage = _md2MessageRouter;
    quakeMapsMessagePort.onmessage = _quakeMapsRouter;
    texturesMessagePort.onmessage = _textureReceiverMessageRouter;

    const _loadItemMap = {
      comment: `map ${mapFilename}`,
      weight: 1,
    };

    resetLoadingManagerState(loadingManagerState);

    loadingManagerState.expectsAtLeast = 5;

    const mapRPCRequest = sendRPCMessage(_rpcLookupTable, quakeMapsMessagePort, {
      unmarshal: {
        discardOccluding: {
          x: _cameraDirection.x,
          y: _cameraDirection.y,
          z: _cameraDirection.z,
        },
        filename: mapFilename,
        rpc: MathUtils.generateUUID(),
      },
    });

    const {
      unmarshal: { entities },
    } = await notifyLoadingManager(loadingManagerState, _loadItemMap, mapRPCRequest);

    await Promise.all(entities.map(_addMapEntity));

    rendererState.renderer.shadowMap.needsUpdate = true;
    state.isPreloading = false;
    state.isPreloaded = true;

    resetLoadingManagerState(loadingManagerState);

    console.log(_nextMap);

    _unmountables.add(function () {
      atlasMessagePort.onmessage = null;
      md2MessagePort.onmessage = null;
      quakeMapsMessagePort.onmessage = null;
      texturesMessagePort.onmessage = null;
    });
  }

  function unmount(): void {
    state.isMounted = false;

    eventBus.POINTER_ZOOM_REQUEST.delete(_onPointerZoomRequest);
    domMessagePort.postMessage(_clearRendererMessage);

    _unmountables.forEach(invoke);
    _unmountables.clear();
  }

  function update(delta: number): void {
    domMessagePort.postMessage({
      render: {
        route: "/map",
      },
    });

    if (isPrimaryPointerPressed(inputState)) {
      _pointerVector.x = getPrimaryPointerVectorX(inputState);
      _pointerVector.y = getPrimaryPointerVectorY(inputState);
      _pointerVector.rotateAround(_pointerVectorRotationPivot, (3 * Math.PI) / 4);
      _playerPosition.x += 10 * _pointerVector.y;
      _playerPosition.z += 10 * _pointerVector.x;
      _onCameraUpdate();
    }
  }

  function _addMapEntity<K extends keyof EntityLookup>(entity: EntityLookup[K]): void | Promise<void> {
    const classname = entity.classname;

    if (!entityLookupTable.hasOwnProperty(classname)) {
      throw new Error(`Unknown entity class: ${classname}`);
    }

    logger.trace("ADD MAP ENTITY", classname);

    return (entityLookupTable[classname] as EntityLookupCallback<K>)(entity);
  }

  function _createTextureUrl(textureName: string): string {
    return `/${textureName}.png`;
  }

  async function _loadTexture(textureUrl: string): Promise<ITexture> {
    const loadItemTexture = {
      comment: `texture ${textureUrl}`,
      weight: 1,
    };

    const textureRequest = requestTexture<ITexture>(_rpcLookupTable, texturesMessagePort, textureUrl);
    const texture = await notifyLoadingManager(loadingManagerState, loadItemTexture, textureRequest);

    return texture;
  }

  function _nextMap(filename: string): void {
    // prettier-ignore
    directorState.next = MapScene(
      logger,
      directorState,
      eventBus,
      inputState,
      atlasMessagePort,
      domMessagePort,
      md2MessagePort,
      quakeMapsMessagePort,
      texturesMessagePort,
      loadingManagerState,
      rendererState,
      mapFilename,
    );
  }

  function _onCameraUpdate(): void {
    // prettier-ignore
    _camera.position.set(
      _playerPosition.x + _cameraZoomAmount,
      _playerPosition.y + _cameraZoomAmount,
      _playerPosition.z + _cameraZoomAmount
    );

    _camera.lookAt(_playerPosition.x, _playerPosition.y, _playerPosition.z);
  }

  function _onPointerZoomRequest(zoomAmount: number): void {
    _cameraZoomAmount += zoomAmount < 0 ? -200 : 200;
    _cameraZoomAmount = Math.max(CAMERA_ZOOM_MAX, _cameraZoomAmount);
    _cameraZoomAmount = Math.min(CAMERA_ZOOM_MIN, _cameraZoomAmount);
    _onCameraUpdate();
  }

  function _unmountFromRenderer() {
    rendererState.camera = null;
    rendererState.scene = null;
  }

  return Object.freeze({
    name: `Map(${mapFilename})`,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
  });
}
