import { createRouter } from "@personalidol/framework/src/createRouter";
import { generateUUID } from "@personalidol/math/src/generateUUID";
import { pause } from "@personalidol/framework/src/pause";
import { unpause } from "@personalidol/framework/src/unpause";

import { isMainMenuScene } from "./isMainMenuScene";
import { MainMenuScene } from "./MainMenuScene";
import { LocationMapScene } from "./LocationMapScene";

import type { Logger } from "loglevel";

import type { CSS2DRenderer } from "@personalidol/three-css2d-renderer/src/CSS2DRenderer.interface";
import type { DirectorState } from "@personalidol/framework/src/DirectorState.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { Scene } from "@personalidol/framework/src/Scene.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { GameState } from "./GameState.type";
import type { GameStateController as IGameStateController } from "./GameStateController.interface";
import type { UIState } from "./UIState.type";
import type { UserSettings } from "./UserSettings.type";

export function GameStateController(
  logger: Logger,
  userSettings: UserSettings,
  effectComposer: EffectComposer,
  css2DRenderer: CSS2DRenderer,
  directorState: DirectorState,
  eventBus: EventBus,
  tickTimerState: TickTimerState,
  dimensionsState: Uint32Array,
  keyboardState: Uint8Array,
  mouseState: Int32Array,
  touchState: Int32Array,
  domMessagePort: MessagePort,
  dynamicsMessagePort: MessagePort,
  fontPreloadMessagePort: MessagePort,
  gameMessagePort: MessagePort,
  gltfMessagePort: MessagePort,
  internationalizationMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  gameState: GameState,
  uiState: UIState
): IGameStateController {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  const _gameMessageRouter = createRouter({
    currentLocationMap: _onCurrentMapMessage,
    isScenePaused: _onIsScenePausedMessage,
  });

  let _actuallyLoadedMap: null | string = null;
  let _currentScene: null | Scene = null;
  let _isDynamicsWorldPaused: boolean = false;
  let _uiStateCurrentMap: null | string = gameState.currentLocationMap;

  function _onCurrentMapMessage(mapName: null | string): void {
    gameState.currentLocationMap = mapName;
  }

  function _onIsScenePausedMessage(isScenePaused: boolean): void {
    gameState.isScenePaused = isScenePaused;
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
    gameState.currentLocationMap = null;
    gameState.previousLocationMap = null;
  }

  function _transitionToMapScene(targetMap: string): void {
    directorState.next = LocationMapScene(
      logger,
      userSettings,
      effectComposer,
      css2DRenderer,
      eventBus,
      tickTimerState,
      dimensionsState,
      keyboardState,
      mouseState,
      touchState,
      gameState,
      uiState,
      domMessagePort,
      dynamicsMessagePort,
      gltfMessagePort,
      internationalizationMessagePort,
      md2MessagePort,
      progressMessagePort,
      quakeMapsMessagePort,
      texturesMessagePort,
      targetMap,
      `${__ASSETS_BASE_PATH}/maps/${targetMap}.map?${__CACHE_BUST}`
    );

    gameState.currentLocationMap = targetMap;
  }

  function start() {
    gameMessagePort.onmessage = _gameMessageRouter;
  }

  function stop() {
    gameMessagePort.onmessage = null;
  }

  function update(): void {
    if (directorState.isTransitioning) {
      // Don't do any more transitioning while the Director is transitioning.
      return;
    }

    _uiStateCurrentMap = gameState.currentLocationMap;

    if (!_uiStateCurrentMap && !isMainMenuScene(directorState.current)) {
      // Default to the main menu in any case.
      _transitionToMainMenuScene();
      return;
    }

    if (_uiStateCurrentMap && _uiStateCurrentMap !== _actuallyLoadedMap) {
      gameState.previousLocationMap = _actuallyLoadedMap;
      _actuallyLoadedMap = _uiStateCurrentMap;

      _transitionToMapScene(_uiStateCurrentMap);
      return;
    }

    _currentScene = directorState.current;

    if (_isDynamicsWorldPaused !== gameState.isScenePaused) {
      _isDynamicsWorldPaused = gameState.isScenePaused;

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

    if (_currentScene && _currentScene.state.isPaused !== gameState.isScenePaused) {
      if (!gameState.isScenePaused) {
        unpause(logger, _currentScene);
      }
      if (gameState.isScenePaused) {
        pause(logger, _currentScene);
      }
    }
  }

  return Object.seal({
    id: generateUUID(),
    name: "GameStateController",
    state: state,
    gameState: gameState,

    start: start,
    stop: stop,
    update: update,
  });
}
