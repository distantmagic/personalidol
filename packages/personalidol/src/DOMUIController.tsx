import { h, render as preactRender } from "preact";

import { clearHTMLElement } from "@personalidol/dom-renderer/src/clearHTMLElement";
import { createRouter } from "@personalidol/workers/src/createRouter";

import { LoadingErrorScreen } from "../components/LoadingErrorScreen";
import { LoadingScreen } from "../components/LoadingScreen";
import { MainMenuScreen } from "../components/MainMenuScreen";
import { OptionsSubView } from "../components/OptionsSubView";

import { createUIComponentsRouter } from "./createUIComponentsRouter";
import { createUIState } from "./createUIState";
import { createUIStateMessageRoutes } from "./createUIStateMessageRoutes";

import type { DOMUIController as IDOMUIController } from "@personalidol/dom-renderer/src/DOMUIController.interface";

import type { UIState } from "./UIState.type";

export function DOMUIController(domMessagePort: MessagePort, uiRootElement: HTMLElement): IDOMUIController {
  const _uiState: UIState = createUIState();
  let _isCleared: boolean = false;

  const _uiComponentsRouter = createUIComponentsRouter({
    cLoadingError(props) {
      return <LoadingErrorScreen loadingError={props.loadingError} />;
    },

    cLoadingScreen(props) {
      return <LoadingScreen loadingManagerProgress={props.loadingManagerProgress} />;
    },

    cMainMenu() {
      return <MainMenuScreen domMessagePort={domMessagePort} uiState={_uiState} uiStateUpdateCallback={_uiStateUpdateCallback} />;
    },

    cOptions() {
      return <OptionsSubView domMessagePort={domMessagePort} uiState={_uiState} uiStateUpdateCallback={_uiStateUpdateCallback} />;
    },
  });

  const _uiMessageRouter = createRouter(createUIStateMessageRoutes(_uiState, _render));

  function start() {
    domMessagePort.onmessage = _uiMessageRouter;
  }

  function stop() {
    domMessagePort.onmessage = null;
  }

  function update() {}

  function _render() {
    if (!_isCleared) {
      clearHTMLElement(uiRootElement);
      _isCleared = true;
    }

    preactRender(_uiComponentsRouter(_uiState), uiRootElement);
  }

  function _uiStateUpdateCallback(updatedUiState: UIState) {
    Object.assign(_uiState, updatedUiState);
    _render();
  }

  return Object.freeze({
    name: "DOMUIController",

    start: start,
    stop: stop,
    update: update,
  });
}
