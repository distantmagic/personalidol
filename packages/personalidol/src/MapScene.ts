import { Color } from "three/src/math/Color";
import { Fog } from "three/src/scenes/Fog";
import { MathUtils } from "three/src/math/MathUtils";
import { Scene } from "three/src/scenes/Scene";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { createRPCLookupTable } from "@personalidol/framework/src/createRPCLookupTable";
import { createTextureReceiverMessagesRouter } from "@personalidol/texture-loader/src/createTextureReceiverMessagesRouter";
import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { disposeAll } from "@personalidol/framework/src/disposeAll";
import { getI18NextKeyNamespace } from "@personalidol/i18n/src/getI18NextKeyNamespace";
import { handleRPCResponse } from "@personalidol/framework/src/handleRPCResponse";
import { imageDataBufferResponseToTexture } from "@personalidol/texture-loader/src/imageDataBufferResponseToTexture";
import { mount as fMount } from "@personalidol/framework/src/mount";
import { pause as fPause } from "@personalidol/framework/src/pause";
import { preload as fPreload } from "@personalidol/framework/src/preload";
import { Raycaster } from "@personalidol/input/src/Raycaster";
import { RenderPass } from "@personalidol/three-modules/src/postprocessing/RenderPass";
import { sendRPCMessage } from "@personalidol/framework/src/sendRPCMessage";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";
import { unmountAll } from "@personalidol/framework/src/unmountAll";
import { unmountPass } from "@personalidol/three-modules/src/unmountPass";
import { unpause as fUnpause } from "@personalidol/framework/src/unpause";
import { ViewBag } from "@personalidol/views/src/ViewBag";

import { buildViews } from "./buildViews";
import { CameraController } from "./CameraController";
import { EntityControllerFactory } from "./EntityControllerFactory";
import { EntityViewFactory } from "./EntityViewFactory";
import { InstancedGLTFModelViewManager } from "./InstancedGLTFModelViewManager";
import { isEntityWithController } from "./isEntityWithController";
import { isEntityWithObjectLabel } from "./isEntityWithObjectLabel";
import { UserInputEventBusController } from "./UserInputEventBusController";
import { UserInputKeyboardController } from "./UserInputKeyboardController";
import { UserInputMouseController } from "./UserInputMouseController";
import { UserInputTouchController } from "./UserInputTouchController";

import type { Logger } from "loglevel";

import type { CameraController as ICameraController } from "@personalidol/framework/src/CameraController.interface";
import type { CSS2DRenderer } from "@personalidol/three-css2d-renderer/src/CSS2DRenderer.interface";
import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { Raycaster as IRaycaster } from "@personalidol/input/src/Raycaster.interface";
import type { RPCLookupTable } from "@personalidol/framework/src/RPCLookupTable.type";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";
import type { UserInputController } from "@personalidol/input/src/UserInputController.interface";
import type { UserInputMouseController as IUserInputMouseController } from "@personalidol/input/src/UserInputMouseController.interface";
// import type { View } from "@personalidol/views/src/View.interface";
import type { ViewBag as IViewBag } from "@personalidol/views/src/ViewBag.interface";

import type { AnyEntity } from "./AnyEntity.type";
import type { EntityController } from "./EntityController.interface";
import type { EntityControllerFactory as IEntityControllerFactory } from "./EntityControllerFactory.interface";
import type { EntityViewFactory as IEntityViewFactory } from "./EntityViewFactory.interface";
import type { InstancedGLTFModelViewManager as IInstancedGLTFModelViewManager } from "./InstancedGLTFModelViewManager.interface";
import type { MapScene as IMapScene } from "./MapScene.interface";
import type { MessageUIStateChange } from "./MessageUIStateChange.type";
import type { UserSettings } from "./UserSettings.type";

const _disposables: Set<DisposableCallback> = new Set();
const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();
const _unmountables: Set<UnmountableCallback> = new Set();

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
  uiMessagePort: MessagePort,
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

  let _isScenePreloaded: boolean = false;

  const _scene = new Scene();
  const _cameraController: ICameraController = CameraController(logger, userSettings, dimensionsState, keyboardState);
  const _raycaster: IRaycaster = Raycaster(_cameraController, dimensionsState, mouseState, touchState);
  const _userInputEventBusController: UserInputController = UserInputEventBusController(userSettings, eventBus, _cameraController);
  const _userInputKeyboardController: UserInputController = UserInputKeyboardController(userSettings, keyboardState, _cameraController);
  const _userInputMouseController: IUserInputMouseController = UserInputMouseController(userSettings, dimensionsState, mouseState, _raycaster);
  const _userInputTouchController: UserInputController = UserInputTouchController(userSettings, dimensionsState, touchState);
  const _renderPass = new RenderPass(_scene, _cameraController.camera);
  const _viewBag: IViewBag = ViewBag(logger);

  _scene.background = new Color(0x000000);

  const _fog = new Fog(_scene.background, 0, 0);
  const _instancedGLTFModelViewManager: IInstancedGLTFModelViewManager = InstancedGLTFModelViewManager(
    logger,
    userSettings,
    _scene,
    gltfMessagePort,
    texturesMessagePort,
    _rpcLookupTable
  );

  const _entityControllersBag: Set<EntityController<AnyEntity>> = new Set();
  const _entityControllerFactory: IEntityControllerFactory = EntityControllerFactory(
    _cameraController,
    _userInputEventBusController,
    _userInputKeyboardController,
    _userInputMouseController,
    _userInputTouchController
  );
  const _entityViewFactory: IEntityViewFactory = EntityViewFactory(
    logger,
    userSettings,
    _instancedGLTFModelViewManager,
    _rpcLookupTable,
    _scene,
    domMessagePort,
    md2MessagePort,
    texturesMessagePort
  );

  function dispose(): void {
    state.isDisposed = true;

    fDispose(logger, _viewBag);
    disposeAll(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    fMount(logger, _viewBag);
    fMount(logger, _userInputEventBusController);
    fMount(logger, _userInputKeyboardController);
    fMount(logger, _userInputMouseController);
    fMount(logger, _userInputTouchController);
    fMount(logger, _cameraController);

    _entityControllersBag.forEach(fMount.bind(null, logger));

    progressMessagePort.postMessage({
      reset: true,
    });

    effectComposer.addPass(_renderPass);

    _unmountables.add(unmountPass(effectComposer, _renderPass));
    _disposables.add(disposableGeneric(_renderPass));

    uiMessagePort.postMessage(<MessageUIStateChange>{
      isInGameMenuTriggerVisible: true,
      isMousePointerLayerVisible: true,
      isVirtualJoystickLayerVisible: true,
    });
  }

  function pause(): void {
    state.isPaused = true;

    fPause(logger, _viewBag);
    fPause(logger, _userInputEventBusController);
    fPause(logger, _userInputKeyboardController);
    fPause(logger, _userInputMouseController);
    fPause(logger, _userInputTouchController);
    fPause(logger, _cameraController);

    _entityControllersBag.forEach(fPause.bind(null, logger));
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

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

    for (let view of buildViews(logger, _entityViewFactory, worldspawnTexture, entities)) {
      _viewBag.views.add(view);

      if (isEntityWithController(view.entity)) {
        for (let controller of _entityControllerFactory.create(view)) {
          _entityControllersBag.add(controller);
        }
      }

      if (view.state.needsRaycast) {
        _raycaster.raycastables.add(view);
      }
    }

    _viewBag.views.add(_instancedGLTFModelViewManager);

    _disposables.add(function () {
      gltfMessagePort.onmessage = null;
      internationalizationMessagePort.onmessage = null;
      md2MessagePort.onmessage = null;
      quakeMapsMessagePort.onmessage = null;
      texturesMessagePort.onmessage = null;
    });

    fPreload(logger, _viewBag);

    _isScenePreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    uiMessagePort.postMessage(<MessageUIStateChange>{
      isInGameMenuTriggerVisible: false,
      isMousePointerLayerVisible: false,
      isVirtualJoystickLayerVisible: false,
    });

    fUnmount(logger, _viewBag);
    fUnmount(logger, _userInputEventBusController);
    fUnmount(logger, _userInputKeyboardController);
    fUnmount(logger, _userInputMouseController);
    fUnmount(logger, _userInputTouchController);
    fUnmount(logger, _cameraController);
    unmountAll(_unmountables);

    _entityControllersBag.forEach(fUnmount.bind(null, logger));
  }

  function unpause(): void {
    state.isPaused = false;

    fUnpause(logger, _viewBag);
    fUnpause(logger, _userInputEventBusController);
    fUnpause(logger, _userInputKeyboardController);
    fUnpause(logger, _userInputMouseController);
    fUnpause(logger, _userInputTouchController);
    fUnpause(logger, _cameraController);

    _entityControllersBag.forEach(fUnpause.bind(null, logger));
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    if ("PerspectiveCamera" === _cameraController.camera.type) {
      _scene.fog = _fog;
    } else {
      _scene.fog = null;
    }

    if (state.isPaused) {
      _raycaster.reset();
    } else {
      _raycaster.update(delta, elapsedTime, tickTimerState);
    }

    if (_userInputEventBusController.state.needsUpdates) {
      _userInputEventBusController.update(delta, elapsedTime, tickTimerState);
    }

    _userInputKeyboardController.update(delta, elapsedTime, tickTimerState);
    _userInputMouseController.update(delta, elapsedTime, tickTimerState);
    _userInputTouchController.update(delta, elapsedTime, tickTimerState);

    for (let entityController of _entityControllersBag) {
      entityController.update(delta, elapsedTime, tickTimerState);
    }

    _cameraController.update(delta, elapsedTime, tickTimerState);
    _viewBag.update(delta, elapsedTime, tickTimerState);

    _renderPass.camera = _cameraController.camera;

    _fog.near = _cameraController.camera.far - 1000;
    _fog.far = _cameraController.camera.far;

    effectComposer.render(delta);
    css2DRenderer.render(_scene, _cameraController.camera, false);
  }

  function updatePreloadingState(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    if (_viewBag.state.isPreloading && !_isScenePreloaded) {
      throw new Error("ViewBag may only start preloading if scene is fully preloaded.");
    }

    if (_viewBag.state.isPreloading) {
      _viewBag.updatePreloadingState(delta, elapsedTime, tickTimerState);
    }

    state.isPreloaded = _isScenePreloaded && _viewBag.state.isPreloaded;
    state.isPreloading = state.isPreloading || _viewBag.state.isPreloading;
  }

  return Object.freeze({
    currentMap: mapName,
    id: MathUtils.generateUUID(),
    isDisposable: true,
    isMapScene: true,
    isMountable: true,
    isPollablePreloading: true,
    isPreloadable: true,
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
    updatePreloadingState: updatePreloadingState,
  });
}
