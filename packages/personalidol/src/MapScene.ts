import { Color } from "three/src/math/Color";
import { Fog } from "three/src/scenes/Fog";
import { MathUtils } from "three/src/math/MathUtils";
import { Scene } from "three/src/scenes/Scene";
import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { createRPCLookupTable } from "@personalidol/framework/src/createRPCLookupTable";
import { createTextureReceiverMessagesRouter } from "@personalidol/texture-loader/src/createTextureReceiverMessagesRouter";
import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { disposeAll } from "@personalidol/framework/src/disposeAll";
import { getI18NextKeyNamespace } from "@personalidol/i18n/src/getI18NextKeyNamespace";
import { getPrimaryPointerStretchVectorX } from "@personalidol/framework/src/getPrimaryPointerStretchVectorX";
import { getPrimaryPointerStretchVectorY } from "@personalidol/framework/src/getPrimaryPointerStretchVectorY";
import { handleRPCResponse } from "@personalidol/framework/src/handleRPCResponse";
import { imageDataBufferResponseToTexture } from "@personalidol/texture-loader/src/imageDataBufferResponseToTexture";
import { isPointerInitiatedByRootElement } from "@personalidol/framework/src/isPointerInitiatedByRootElement";
import { isPrimaryPointerPressed } from "@personalidol/framework/src/isPrimaryPointerPressed";
import { KeyboardIndices } from "@personalidol/framework/src/KeyboardIndices.enum";
import { mount as fMount } from "@personalidol/framework/src/mount";
import { pause as fPause } from "@personalidol/framework/src/pause";
import { preload as fPreload } from "@personalidol/framework/src/preload";
import { RenderPass } from "@personalidol/three-modules/src/postprocessing/RenderPass";
import { sendRPCMessage } from "@personalidol/framework/src/sendRPCMessage";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";
import { unmountAll } from "@personalidol/framework/src/unmountAll";
import { unmountPass } from "@personalidol/three-modules/src/unmountPass";
import { unpause as fUnpause } from "@personalidol/framework/src/unpause";

import { AmbientLightView } from "./AmbientLightView";
import { buildViews } from "./buildViews";
import { CameraController } from "./CameraController";
import { HemisphereLightView } from "./HemisphereLightView";
import { InstancedGLTFModelView } from "./InstancedGLTFModelView";
import { InstancedGLTFModelViewManager } from "./InstancedGLTFModelViewManager";
import { isEntityWithObjectLabel } from "./isEntityWithObjectLabel";
import { MD2ModelView } from "./MD2ModelView";
import { PlayerView } from "./PlayerView";
import { PointLightView } from "./PointLightView";
import { resolveScriptedBlockController } from "./resolveScriptedBlockController";
import { ScriptedBlockView } from "./ScriptedBlockView";
import { ScriptedZoneView } from "./ScriptedZoneView";
import { SpotlightLightView } from "./SpotlightLightView";
import { TargetView } from "./TargetView";
import { WorldspawnGeometryView } from "./WorldspawnGeometryView";

import type { Logger } from "loglevel";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { CSS2DRenderer } from "@personalidol/three-css2d-renderer/src/CSS2DRenderer.interface";
import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { MessageDOMUIDispose } from "@personalidol/dom-renderer/src/MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "@personalidol/dom-renderer/src/MessageDOMUIRender.type";
import type { RPCLookupTable } from "@personalidol/framework/src/RPCLookupTable.type";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";
import type { View } from "@personalidol/framework/src/View.interface";

import type { CameraController as ICameraController } from "./CameraController.interface";
import type { DOMElementsLookup } from "./DOMElementsLookup.type";
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
import type { EntityScriptedZone } from "./EntityScriptedZone.type";
import type { EntitySounds } from "./EntitySounds.type";
import type { EntitySparkParticles } from "./EntitySparkParticles.type";
import type { EntityTarget } from "./EntityTarget.type";
import type { EntityWorldspawn } from "./EntityWorldspawn.type";
import type { InstancedGLTFModelViewManager as IInstancedGLTFModelViewManager } from "./InstancedGLTFModelViewManager.interface";
import type { MapScene as IMapScene } from "./MapScene.interface";
import type { UIState } from "./UIState.type";
import type { UserSettings } from "./UserSettings.type";

const _disposables: Set<DisposableCallback> = new Set();
const _playerPosition = new Vector3();
const _pointerVector = new Vector2(0, 0);
const _pointerVectorRotationPivot = new Vector2(0, 0);

const _unmountables: Set<UnmountableCallback> = new Set();

const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();

const _internationalizationMessageRouter = createRouter({
  loadedNamespaces: handleRPCResponse(_rpcLookupTable),
});
const _gltfMessageRouter = createRouter({
  geometry: handleRPCResponse(_rpcLookupTable),
});
const _md2MessageRouter = createRouter({
  geometry: handleRPCResponse(_rpcLookupTable),
});
const _quakeMapsRouter = createRouter({
  map: handleRPCResponse(_rpcLookupTable),
});
const _textureReceiverMessageRouter = createTextureReceiverMessagesRouter(_rpcLookupTable);

export function MapScene(
  logger: Logger,
  userSettings: UserSettings,
  effectComposer: EffectComposer,
  css2DRenderer: CSS2DRenderer,
  eventBus: EventBus,
  views: Set<View>,
  dimensionsState: Uint32Array,
  keyboardState: Uint8Array,
  mouseState: Int32Array,
  touchState: Int32Array,
  domMessagePort: MessagePort,
  gltfMessagePort: MessagePort,
  internationalizationMessagePort: MessagePort,
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
    needsUpdates: true,
  });

  const _cameraController: ICameraController = CameraController(logger, userSettings, dimensionsState, keyboardState, eventBus);
  const _scene = new Scene();
  const _renderPass = new RenderPass(_scene, _cameraController.camera);

  _scene.background = new Color(0x000000);

  const _fog = new Fog(_scene.background, 0, 0);

  const _domMousePointerLayerElementId: string = MathUtils.generateUUID();
  const _domInGameMenuTriggerElementId: string = MathUtils.generateUUID();
  const _instancedGLTFModelViewManager: IInstancedGLTFModelViewManager = InstancedGLTFModelViewManager(
    logger,
    userSettings,
    _scene,
    gltfMessagePort,
    texturesMessagePort,
    _rpcLookupTable
  );

  const entityLookupTable: EntityLookupTable = {
    func_group(entity: EntityFuncGroup): View {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    light_ambient(entity: EntityLightAmbient): View {
      return AmbientLightView(logger, userSettings, _scene, entity);
    },

    light_hemisphere(entity: EntityLightHemisphere): View {
      return HemisphereLightView(logger, userSettings, _scene, entity);
    },

    light_point(entity: EntityLightPoint): View {
      return PointLightView(logger, userSettings, _scene, entity);
    },

    light_spotlight(entity: EntityLightSpotlight, worldspawnTexture: ITexture, targetedViews: Set<View>): View {
      return SpotlightLightView(logger, userSettings, _scene, entity, targetedViews);
    },

    model_gltf(entity: EntityGLTFModel): View {
      _instancedGLTFModelViewManager.expectEntity(entity);

      return InstancedGLTFModelView(logger, userSettings, _scene, entity, _instancedGLTFModelViewManager);
    },

    model_md2(entity: EntityMD2Model): View {
      return MD2ModelView(logger, userSettings, _scene, entity, domMessagePort, md2MessagePort, texturesMessagePort, _rpcLookupTable);
    },

    player(entity: EntityPlayer): View {
      _playerPosition.set(entity.origin.x, entity.origin.y, entity.origin.z);
      _cameraController.position.copy(_playerPosition);
      _cameraController.needsImmediateMove = true;

      return PlayerView(logger, userSettings, _scene, entity, domMessagePort, md2MessagePort, texturesMessagePort, _rpcLookupTable);
    },

    scripted_block(entity: EntityScriptedBlock, worldspawnTexture: ITexture, targetedViews: Set<View>): View {
      return ScriptedBlockView(logger, userSettings, _scene, entity, domMessagePort, worldspawnTexture, views, targetedViews, resolveScriptedBlockController);
    },

    scripted_zone(entity: EntityScriptedZone): View {
      return ScriptedZoneView(logger, userSettings, _scene, entity);
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

    disposeAll(_disposables);
    fDispose(logger, _cameraController);
  }

  function mount(): void {
    state.isMounted = true;

    fMount(logger, _cameraController);

    progressMessagePort.postMessage({
      reset: true,
    });

    effectComposer.addPass(_renderPass);

    _unmountables.add(unmountPass(effectComposer, _renderPass));
    _disposables.add(disposableGeneric(_renderPass));

    domMessagePort.postMessage({
      render: <MessageDOMUIRender<DOMElementsLookup>>{
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
      render: <MessageDOMUIRender<DOMElementsLookup>>{
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
  }

  function pause(): void {
    state.isPaused = true;

    fPause(logger, _cameraController);
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    fPreload(logger, _cameraController);

    gltfMessagePort.onmessage = _gltfMessageRouter;
    internationalizationMessagePort.onmessage = _internationalizationMessageRouter;
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

    const i18Namespaces: Set<string> = new Set();

    for (let entity of entities) {
      if (isEntityWithObjectLabel(entity)) {
        const namespace = getI18NextKeyNamespace(entity.properties.label);

        if (namespace) {
          i18Namespaces.add(namespace);
        }
      }
    }

    if (i18Namespaces.size > 0) {
      await sendRPCMessage(_rpcLookupTable, internationalizationMessagePort, {
        loadNamespaces: {
          namespaces: Array.from(i18Namespaces.values()),
          rpc: MathUtils.generateUUID(),
        },
      });
    }

    for (let view of buildViews(logger, entityLookupTable, worldspawnTexture, entities)) {
      views.add(view);
    }

    views.add(_instancedGLTFModelViewManager);

    state.isPreloading = false;
    state.isPreloaded = true;

    _disposables.add(function () {
      gltfMessagePort.onmessage = null;
      internationalizationMessagePort.onmessage = null;
      md2MessagePort.onmessage = null;
      quakeMapsMessagePort.onmessage = null;
      texturesMessagePort.onmessage = null;
    });
  }

  function unmount(): void {
    state.isMounted = false;

    fUnmount(logger, _cameraController);
    unmountAll(_unmountables);
  }

  function unpause(): void {
    state.isPaused = false;

    fUnpause(logger, _cameraController);
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    if ("PerspectiveCamera" === _cameraController.camera.type) {
      _scene.fog = _fog;
    } else {
      _scene.fog = null;
    }

    if (!state.isPaused && isPrimaryPointerPressed(mouseState, touchState) && isPointerInitiatedByRootElement(mouseState, touchState)) {
      _pointerVector.x = getPrimaryPointerStretchVectorX(mouseState, touchState);
      _pointerVector.y = getPrimaryPointerStretchVectorY(mouseState, touchState);
      _pointerVector.rotateAround(_pointerVectorRotationPivot, (3 * Math.PI) / 4);
      _cameraController.position.x += userSettings.cameraMovementSpeed * _pointerVector.y * delta;
      _cameraController.position.z += userSettings.cameraMovementSpeed * _pointerVector.x * delta;
    }

    if (!state.isPaused && keyboardState[KeyboardIndices.Home]) {
      _cameraController.position.copy(_playerPosition);
      _cameraController.resetZoom();
    }

    _cameraController.update(delta, elapsedTime, tickTimerState);

    _renderPass.camera = _cameraController.camera;

    _fog.near = _cameraController.camera.far - 1000;
    _fog.far = _cameraController.camera.far;

    effectComposer.render(delta);
    css2DRenderer.render(_scene, _cameraController.camera, false);
  }

  return Object.freeze({
    currentMap: mapName,
    id: MathUtils.generateUUID(),
    isMapScene: true,
    isScene: true,
    isViewBaggableScene: true,
    name: `Map("${mapFilename}")`,
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
