import { createRouter } from "@personalidol/framework/src/createRouter";
import { createSingleThreadMessageChannel } from "@personalidol/framework/src/createSingleThreadMessageChannel";
import { DOMElementViewHandle } from "@personalidol/dom-renderer/src/DOMElementViewHandle";
import { generateUUID } from "@personalidol/math/src/generateUUID";
import { pause } from "@personalidol/framework/src/pause";
import { unpause } from "@personalidol/framework/src/unpause";

import { isMainMenuScene } from "./isMainMenuScene";
import { MainMenuScene } from "./MainMenuScene";
import { MapScene } from "./MapScene";

import type { Logger } from "loglevel";

import type { CSS2DRenderer } from "@personalidol/three-css2d-renderer/src/CSS2DRenderer.interface";
import type { DirectorState } from "@personalidol/framework/src/DirectorState.type";
import type { DOMElementViewHandle as IDOMElementViewHandle } from "@personalidol/dom-renderer/src/DOMElementViewHandle.interface";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { Scene } from "@personalidol/framework/src/Scene.interface";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { UIState } from "./UIState.type";
import type { UIStateController as IUIStateController } from "./UIStateController.interface";
import type { UIStateControllerInfo } from "./UIStateControllerInfo.type";
import type { UserSettings } from "./UserSettings.type";

export function UIStateController(
  logger: Logger,
  userSettings: UserSettings,
  effectComposer: EffectComposer,
  css2DRenderer: CSS2DRenderer,
  directorState: DirectorState,
  eventBus: EventBus,
  dimensionsState: Uint32Array,
  keyboardState: Uint8Array,
  mouseState: Int32Array,
  touchState: Int32Array,
  domMessagePort: MessagePort,
  dynamicsMessagePort: MessagePort,
  fontPreloadMessagePort: MessagePort,
  gltfMessagePort: MessagePort,
  internationalizationMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  uiMessagePort: MessagePort,
  uiState: UIState
): IUIStateController {
  const info: UIStateControllerInfo = Object.seal({});

  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  const _domMessageRouter = createRouter({
    currentMap: _onCurrentMapMessage,
    isInGameMenuOpened: _onIsInGameMenuOpenedMessage,
    isInGameMenuTriggerVisible: _onIsInGameMenuTriggerVisible,
    isLanguageSettingsScreenOpened: _onIsLanguageSettingsScreenOpened,
    isMousePointerLayerVisible: _onIsMousePointerLayerVisible,
    isScenePaused: _onIsScenePausedMessage,
    isUserSettingsScreenOpened: _onIsUserSettingsScreenOpenedMessage,
    isVirtualJoystickLayerVisible: _onIsVirtualJoystickLayerVisible,
  });

  let _actuallyLoadedMap: null | string = null;
  let _currentScene: null | Scene = null;
  let _internalUIMessageChannel: MessageChannel = createSingleThreadMessageChannel();
  let _isDynamicsWorldPaused: boolean = false;
  let _uiStateCurrentMap: null | string = uiState.currentMap;

  let _inGameMenuHandle: IDOMElementViewHandle = DOMElementViewHandle<DOMElementsLookup>(domMessagePort, "pi-in-game-menu");
  let _inGameMenuTriggerHandle: IDOMElementViewHandle = DOMElementViewHandle<DOMElementsLookup>(domMessagePort, "pi-in-game-menu-trigger");
  let _languageSettingsScreenHandle: IDOMElementViewHandle = DOMElementViewHandle<DOMElementsLookup>(domMessagePort, "pi-language-settings");
  let _mousePointerLayerHandle: IDOMElementViewHandle = DOMElementViewHandle<DOMElementsLookup>(domMessagePort, "pi-mouse-pointer-layer");
  let _userSettingsScreenHandle: IDOMElementViewHandle = DOMElementViewHandle<DOMElementsLookup>(domMessagePort, "pi-user-settings");
  let _virtualJoystickLayerHandle: IDOMElementViewHandle = DOMElementViewHandle<DOMElementsLookup>(domMessagePort, "pi-virtual-joystick-layer");

  function _onCurrentMapMessage(mapName: null | string): void {
    uiState.currentMap = mapName;
  }

  function _onIsInGameMenuOpenedMessage(isInGameMenuOpened: boolean): void {
    uiState.isInGameMenuOpened = isInGameMenuOpened;
  }

  function _onIsInGameMenuTriggerVisible(isInGameMenuTriggerVisible: boolean): void {
    uiState.isInGameMenuTriggerVisible = isInGameMenuTriggerVisible;
  }

  function _onIsLanguageSettingsScreenOpened(isLanguageSettingsScreenOpened: boolean): void {
    uiState.isLanguageSettingsScreenOpened = isLanguageSettingsScreenOpened;
  }

  function _onIsMousePointerLayerVisible(isMousePointerLayerVisible: boolean): void {
    uiState.isMousePointerLayerVisible = isMousePointerLayerVisible;
  }

  function _onIsScenePausedMessage(isScenePaused: boolean): void {
    uiState.isScenePaused = isScenePaused;
  }

  function _onIsUserSettingsScreenOpenedMessage(isUserSettingsScreenOpened: boolean): void {
    uiState.isUserSettingsScreenOpened = isUserSettingsScreenOpened;
  }

  function _onIsVirtualJoystickLayerVisible(isVirtualJoystickLayerVisible: boolean): void {
    uiState.isVirtualJoystickLayerVisible = isVirtualJoystickLayerVisible;
  }

  function _transitionToMainMenuScene(): void {
    if (isMainMenuScene(directorState.current)) {
      throw new Error("Already at the main menu.");
    }

    // prettier-ignore
    directorState.next = MainMenuScene(
      logger,
      effectComposer,
      domMessagePort,
      fontPreloadMessagePort,
      progressMessagePort,
    );

    _actuallyLoadedMap = null;
    uiState.currentMap = null;
    uiState.previousMap = null;
  }

  function _transitionToMapScene(targetMap: string): void {
    directorState.next = MapScene(
      logger,
      userSettings,
      effectComposer,
      css2DRenderer,
      eventBus,
      dimensionsState,
      keyboardState,
      mouseState,
      touchState,
      uiState,
      domMessagePort,
      dynamicsMessagePort,
      gltfMessagePort,
      internationalizationMessagePort,
      md2MessagePort,
      progressMessagePort,
      quakeMapsMessagePort,
      texturesMessagePort,
      _internalUIMessageChannel.port2,
      targetMap,
      `${__ASSETS_BASE_PATH}/maps/${targetMap}.map?${__CACHE_BUST}`
    );

    uiState.currentMap = targetMap;
  }

  function start() {
    _internalUIMessageChannel.port1.onmessage = _domMessageRouter;
    uiMessagePort.onmessage = _domMessageRouter;
  }

  function stop() {
    _internalUIMessageChannel.port1.onmessage = null;
    uiMessagePort.onmessage = null;
  }

  function update(): void {
    _inGameMenuHandle.enable(uiState.isInGameMenuOpened);
    _inGameMenuTriggerHandle.enable(uiState.isInGameMenuTriggerVisible);
    _languageSettingsScreenHandle.enable(uiState.isLanguageSettingsScreenOpened);
    _mousePointerLayerHandle.enable(uiState.isMousePointerLayerVisible);
    _userSettingsScreenHandle.enable(uiState.isUserSettingsScreenOpened);
    _virtualJoystickLayerHandle.enable(uiState.isVirtualJoystickLayerVisible);

    if (directorState.isTransitioning) {
      // Don't do any more transitioning while the Director is transitioning.
      return;
    }

    _uiStateCurrentMap = uiState.currentMap;

    if (!_uiStateCurrentMap && !isMainMenuScene(directorState.current)) {
      // Default to the main menu in any case.
      _transitionToMainMenuScene();
      return;
    }

    if (_uiStateCurrentMap && _uiStateCurrentMap !== _actuallyLoadedMap) {
      uiState.previousMap = _actuallyLoadedMap;
      _actuallyLoadedMap = _uiStateCurrentMap;

      _transitionToMapScene(_uiStateCurrentMap);
      return;
    }

    _currentScene = directorState.current;

    if (_isDynamicsWorldPaused !== uiState.isScenePaused) {
      _isDynamicsWorldPaused = uiState.isScenePaused;

      if (_isDynamicsWorldPaused) {
        dynamicsMessagePort.postMessage({
          pause: null,
        });
      } else {
        dynamicsMessagePort.postMessage({
          unpause: null,
        });
      }
    }

    if (_currentScene && _currentScene.state.isPaused !== uiState.isScenePaused) {
      if (!uiState.isScenePaused) {
        unpause(logger, _currentScene);
      }
      if (uiState.isScenePaused) {
        pause(logger, _currentScene);
      }
    }
  }

  return Object.seal({
    id: generateUUID(),
    info: info,
    name: "UIStateController",
    state: state,
    uiState: uiState,

    start: start,
    stop: stop,
    update: update,
  });
}
