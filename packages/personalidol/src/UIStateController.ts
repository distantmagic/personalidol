import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { ViewBag } from "@personalidol/loading-manager/src/ViewBag";
import { ViewBagScene } from "@personalidol/loading-manager/src/ViewBagScene";

import { isMainMenuScene } from "./isMainMenuScene";
import { MainMenuScene } from "./MainMenuScene";
import { MapScene } from "./MapScene";

import type { Logger } from "loglevel";

import type { CSS2DRenderer } from "@personalidol/three-renderer/src/CSS2DRenderer.interface";
import type { DirectorState } from "@personalidol/loading-manager/src/DirectorState.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { ViewBag as IViewBag } from "@personalidol/loading-manager/src/ViewBag.interface";

import type { UIState } from "./UIState.type";
import type { UIStateController as IUIStateController } from "./UIStateController.interface";
import type { UserSettings } from "./UserSettings.type";

export function UIStateController(
  logger: Logger,
  userSettings: UserSettings,
  effectComposer: EffectComposer,
  css2DRenderer: CSS2DRenderer,
  directorState: DirectorState,
  eventBus: EventBus,
  dimensionsState: Uint32Array,
  inputState: Int32Array,
  domMessagePort: MessagePort,
  fontPreloadMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  uiMessagePort: MessagePort,
  uiState: UIState
): IUIStateController {
  const _domMessageRouter = createRouter({
    currentMap: _onCurrentMapMessage,
  });

  let _dirtyCurrentMap: null | string = null;

  let _uiStateCurrentMap: null | string = null;

  function start() {
    uiMessagePort.onmessage = _domMessageRouter;
  }

  function stop() {
    uiMessagePort.onmessage = null;
  }

  function update(delta: number, elapsedTime: number): void {
    if (directorState.isTransitioning) {
      return;
    }

    _uiStateCurrentMap = uiState.currentMap;

    if (!_uiStateCurrentMap) {
      // Default to the main menu in any case.
      _transitionToMainMenuScene();
      return;
    }

    if (_uiStateCurrentMap === _dirtyCurrentMap) {
      return;
    }

    if (_uiStateCurrentMap !== _dirtyCurrentMap) {
      _transitionToaMapScene(_uiStateCurrentMap);
      return;
    }
  }

  function _onCurrentMapMessage(mapName: null | string): void {
    uiState.currentMap = mapName;
  }

  function _transitionToMainMenuScene(): void {
    if (isMainMenuScene(directorState.current)) {
      return;
    }

    // prettier-ignore
    directorState.next = MainMenuScene(
      logger,
      domMessagePort,
      fontPreloadMessagePort,
      progressMessagePort,
    );

    _dirtyCurrentMap = null;
    uiState.currentMap = null;
  }

  function _transitionToaMapScene(targetMap: string): void {
    const viewBag: IViewBag = ViewBag(logger);

    // prettier-ignore
    const mapScene = MapScene(
      logger,
      userSettings,
      effectComposer,
      css2DRenderer,
      eventBus,
      viewBag.views,
      dimensionsState,
      inputState,
      domMessagePort,
      md2MessagePort,
      progressMessagePort,
      quakeMapsMessagePort,
      texturesMessagePort,
      targetMap,
      `${__ASSETS_BASE_PATH}/maps/${targetMap}.map?${__CACHE_BUST}`,
    );

    directorState.next = ViewBagScene(logger, viewBag, mapScene);

    uiState.currentMap = targetMap;
    _dirtyCurrentMap = targetMap;
  }

  return Object.seal({
    id: MathUtils.generateUUID(),
    name: "UIStateController",

    start: start,
    stop: stop,
    update: update,
  });
}
