import { Color } from "three/src/math/Color";
import { Fog } from "three/src/scenes/Fog";
import { MathUtils } from "three/src/math/MathUtils";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Scene } from "three/src/scenes/Scene";
import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { createRPCLookupTable } from "@personalidol/framework/src/createRPCLookupTable";
import { createTextureReceiverMessagesRouter } from "@personalidol/texture-loader/src/createTextureReceiverMessagesRouter";
import { damp } from "@personalidol/framework/src/damp";
import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { getPrimaryPointerStretchVectorX } from "@personalidol/framework/src/getPrimaryPointerStretchVectorX";
import { getPrimaryPointerStretchVectorY } from "@personalidol/framework/src/getPrimaryPointerStretchVectorY";
import { handleRPCResponse } from "@personalidol/framework/src/handleRPCResponse";
import { imageDataBufferResponseToTexture } from "@personalidol/texture-loader/src/imageDataBufferResponseToTexture";
import { isPrimaryPointerInitiatedByRootElement } from "@personalidol/framework/src/isPrimaryPointerInitiatedByRootElement";
import { isPrimaryPointerPressed } from "@personalidol/framework/src/isPrimaryPointerPressed";
import { mount as fMount } from "@personalidol/framework/src/mount";
import { RenderPass } from "@personalidol/three-modules/src/postprocessing/RenderPass";
import { sendRPCMessage } from "@personalidol/framework/src/sendRPCMessage";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";
import { unmountPass } from "@personalidol/three-modules/src/unmountPass";
import { updateStoreCameraAspect } from "@personalidol/three-renderer/src/updateStoreCameraAspect";

import { AmbientLightView } from "./AmbientLightView";
import { buildViews } from "./buildViews";
import { HemisphereLightView } from "./HemisphereLightView";
import { MD2ModelView } from "./MD2ModelView";
import { PlayerView } from "./PlayerView";
import { PointLightView } from "./PointLightView";
import { resolveScriptedBlockController } from "./resolveScriptedBlockController";
import { ScriptedBlockView } from "./ScriptedBlockView";
import { SpotlightLightView } from "./SpotlightLightView";
import { TargetView } from "./TargetView";
import { WorldspawnGeometryView } from "./WorldspawnGeometryView";

import type { Logger } from "loglevel";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { CSS2DRenderer } from "@personalidol/three-renderer/src/CSS2DRenderer.interface";
import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { MessageDOMUIDispose } from "@personalidol/dom-renderer/src/MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "@personalidol/dom-renderer/src/MessageDOMUIRender.type";
import type { MountableCallback } from "@personalidol/framework/src/MountableCallback.type";
import type { RPCLookupTable } from "@personalidol/framework/src/RPCLookupTable.type";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";
import type { View } from "@personalidol/framework/src/View.interface";

import type { EntityFuncGroup } from "./EntityFuncGroup.type";
import type { EntityGLTFModel } from "./EntityGLTFModel.type";
import type { EntityLightAmbient } from "./EntityLightAmbient.type";
import type { EntityLightHemisphere } from "./EntityLightHemisphere.type";
import type { EntityLightPoint } from "./EntityLightPoint.type";
import type { EntityLightSpotlight } from "./EntityLightSpotlight.type";
import type { EntityLookupTable } from "./EntityLookupTable.type";
import type { EntityMD2Model } from "./EntityMD2Model.type";
import type { EntityPlayer } from "./EntityPlayer.type";
import type { EntityScriptedBlock } from "./EntityScriptedBlock.type";
import type { EntitySounds } from "./EntitySounds.type";
import type { EntitySparkParticles } from "./EntitySparkParticles.type";
import type { EntityTarget } from "./EntityTarget.type";
import type { EntityWorldspawn } from "./EntityWorldspawn.type";
import type { MapScene as IMapScene } from "./MapScene.interface";
import type { UIState } from "./UIState.type";
import type { UserSettings } from "./UserSettings.type";

const CAMERA_DAMP = 10;
const CAMERA_ZOOM_INITIAL = 401;
const CAMERA_ZOOM_MAX = 1;
const CAMERA_ZOOM_MIN = 1401;
const CAMERA_ZOOM_STEP = 50;

const _camera = new PerspectiveCamera();

_camera.far = 4000;
_camera.near = 1;

const _cameraDirection = new Vector3();
const _disposables: Set<DisposableCallback> = new Set();
const _playerPosition = new Vector3();
const _pointerVector = new Vector2(0, 0);
const _pointerVectorRotationPivot = new Vector2(0, 0);
const _scene = new Scene();

_scene.background = new Color(0x000000);
_scene.fog = new Fog(_scene.background, _camera.far - 1000, _camera.far);

const _mountables: Set<MountableCallback> = new Set();
const _unmountables: Set<UnmountableCallback> = new Set();

const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();
const _md2MessageRouter = createRouter({
  geometry: handleRPCResponse(_rpcLookupTable),
});
const _quakeMapsRouter = createRouter({
  map: handleRPCResponse(_rpcLookupTable),
});
const _textureReceiverMessageRouter = createTextureReceiverMessagesRouter(_rpcLookupTable);
let _cameraZoomAmount = 0;

export function MapScene(
  logger: Logger,
  userSettings: UserSettings,
  effectComposer: EffectComposer,
  css2DRenderer: CSS2DRenderer,
  eventBus: EventBus,
  views: Set<View>,
  dimensionsState: Uint32Array,
  inputState: Int32Array,
  domMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  uiState: UIState,
  mapName: string,
  mapFilename: string
): IMapScene {
  const state: SceneState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _domMousePointerLayerElementId: string = MathUtils.generateUUID();
  const _domInGameMenuTriggerElementId: string = MathUtils.generateUUID();
  let _cameraSkipDamping: boolean = true;

  _camera.position.set(100, 100, 100);
  _camera.lookAt(0, 0, 0);
  _camera.getWorldDirection(_cameraDirection);

  const entityLookupTable: EntityLookupTable = {
    func_group(entity: EntityFuncGroup): View {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    light_ambient(entity: EntityLightAmbient): View {
      return AmbientLightView(userSettings, _scene, entity);
    },

    light_hemisphere(entity: EntityLightHemisphere): View {
      return HemisphereLightView(userSettings, _scene, entity);
    },

    light_point(entity: EntityLightPoint): View {
      return PointLightView(userSettings, _scene, entity);
    },

    light_spotlight(entity: EntityLightSpotlight, worldspawnTexture: ITexture, targetedViews: Set<View>): View {
      return SpotlightLightView(userSettings, _scene, entity, targetedViews);
    },

    model_gltf(entity: EntityGLTFModel): View {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
      // const model = await loaders.gltf.loadAsync(`/models/model-glb-${entity.model_name}/model.glb`);
      // const mesh = model.scene.children[0] as Mesh;

      // mesh.position.set(entity.origin.x, entity.origin.y, entity.origin.z);

      // _mountables.add(function () {
      //   _scene.add(mesh);
      // });

      // _disposables.add(disposableGeneric(mesh.geometry));
      // _disposables.add(disposableMaterial(mesh.material));

      // _unmountables.add(function () {
      //   _scene.remove(mesh);
      // });
    },

    model_md2(entity: EntityMD2Model): View {
      return MD2ModelView(userSettings, _scene, entity, domMessagePort, md2MessagePort, texturesMessagePort, _rpcLookupTable);
    },

    player(entity: EntityPlayer): View {
      _playerPosition.set(entity.origin.x, entity.origin.y, entity.origin.z);
      _cameraSkipDamping = true;

      return PlayerView(_scene, entity);
    },

    scripted_block(entity: EntityScriptedBlock, worldspawnTexture: ITexture, targetedViews: Set<View>): View {
      return ScriptedBlockView(logger, userSettings, _scene, entity, domMessagePort, worldspawnTexture, views, targetedViews, resolveScriptedBlockController);
    },

    sounds(entity: EntitySounds): View {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    spark_particles(entity: EntitySparkParticles): View {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    target(entity: EntityTarget): View {
      return TargetView(_scene, entity);
    },

    worldspawn(entity: EntityWorldspawn, worldspawnTexture: ITexture): View {
      return WorldspawnGeometryView(logger, userSettings, _scene, entity, worldspawnTexture);
    },
  };

  function dispose(): void {
    state.isDisposed = true;

    fDispose(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    fMount(_mountables);

    eventBus.POINTER_ZOOM_REQUEST.add(_onPointerZoomRequest);

    const renderPass = new RenderPass(_scene, _camera);

    effectComposer.addPass(renderPass);
    _unmountables.add(unmountPass(effectComposer, renderPass));
    _disposables.add(disposableGeneric(renderPass));

    domMessagePort.postMessage({
      render: <MessageDOMUIRender>{
        id: _domMousePointerLayerElementId,
        element: "pi-mouse-pointer-layer",
        props: {},
      },
    });

    _unmountables.add(function () {
      domMessagePort.postMessage({
        dispose: <MessageDOMUIDispose>[_domMousePointerLayerElementId],
      });
    });

    domMessagePort.postMessage({
      render: <MessageDOMUIRender>{
        id: _domInGameMenuTriggerElementId,
        element: "pi-in-game-menu-trigger",
        props: {},
      },
    });

    _unmountables.add(function () {
      domMessagePort.postMessage({
        dispose: <MessageDOMUIDispose>[_domInGameMenuTriggerElementId],
      });
    });

    _cameraZoomAmount = CAMERA_ZOOM_INITIAL;
  }

  function pause(): void {
    state.isPaused = true;
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    md2MessagePort.onmessage = _md2MessageRouter;
    quakeMapsMessagePort.onmessage = _quakeMapsRouter;
    texturesMessagePort.onmessage = _textureReceiverMessageRouter;

    progressMessagePort.postMessage({
      reset: true,
    });

    const {
      unmarshal: { entities, textureAtlas },
    } = await sendRPCMessage(_rpcLookupTable, quakeMapsMessagePort, {
      unmarshal: {
        filename: mapFilename,
        rpc: MathUtils.generateUUID(),
      },
    });

    const worldspawnTexture = imageDataBufferResponseToTexture(textureAtlas);

    _disposables.add(disposableGeneric(worldspawnTexture));

    for (let view of buildViews(logger, entityLookupTable, worldspawnTexture, entities)) {
      views.add(view);
    }

    state.isPreloading = false;
    state.isPreloaded = true;

    _unmountables.add(function () {
      md2MessagePort.onmessage = _md2MessageRouter;
      quakeMapsMessagePort.onmessage = _quakeMapsRouter;
      texturesMessagePort.onmessage = _textureReceiverMessageRouter;
    });
  }

  function unmount(): void {
    state.isMounted = false;

    eventBus.POINTER_ZOOM_REQUEST.delete(_onPointerZoomRequest);

    fUnmount(_unmountables);
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number, elapsedTime: number): void {
    updateStoreCameraAspect(_camera, dimensionsState);

    if (!state.isPaused && isPrimaryPointerPressed(inputState) && isPrimaryPointerInitiatedByRootElement(inputState)) {
      _pointerVector.x = getPrimaryPointerStretchVectorX(inputState);
      _pointerVector.y = getPrimaryPointerStretchVectorY(inputState);
      _pointerVector.rotateAround(_pointerVectorRotationPivot, (3 * Math.PI) / 4);
      _playerPosition.x += 1000 * _pointerVector.y * delta;
      _playerPosition.z += 1000 * _pointerVector.x * delta;
    }

    _updateCamera(delta);

    effectComposer.render(delta);
    css2DRenderer.render(_scene, _camera, false);
  }

  function _updateCamera(delta: number): void {
    // prettier-ignore
    if (_cameraSkipDamping) {
      _camera.position.set(
        _playerPosition.x + _cameraZoomAmount,
        _playerPosition.y + _cameraZoomAmount,
        _playerPosition.z + _cameraZoomAmount
      );
      _cameraSkipDamping = false;
    } else {
      _camera.position.set(
        damp(_camera.position.x, _playerPosition.x + _cameraZoomAmount, CAMERA_DAMP, delta),
        damp(_camera.position.y, _playerPosition.y + _cameraZoomAmount, CAMERA_DAMP, delta),
        damp(_camera.position.z, _playerPosition.z + _cameraZoomAmount, CAMERA_DAMP, delta),
      );
    }

    _camera.lookAt(_camera.position.x - _cameraZoomAmount, _camera.position.y - _cameraZoomAmount, _camera.position.z - _cameraZoomAmount);
  }

  function _onPointerZoomRequest(zoomAmount: number): void {
    if (state.isPaused) {
      return;
    }

    _cameraZoomAmount += zoomAmount < 0 ? -1 * CAMERA_ZOOM_STEP : CAMERA_ZOOM_STEP;
    _cameraZoomAmount = Math.max(CAMERA_ZOOM_MAX, _cameraZoomAmount);
    _cameraZoomAmount = Math.min(CAMERA_ZOOM_MIN, _cameraZoomAmount);
  }

  return Object.freeze({
    currentMap: mapName,
    id: MathUtils.generateUUID(),
    isMapScene: true,
    isScene: true,
    name: `Map(${mapFilename})`,
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
