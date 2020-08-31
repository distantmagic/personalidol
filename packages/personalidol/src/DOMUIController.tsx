import { h, render as preactRender } from "preact";

import { clearHTMLElement } from "@personalidol/dom-renderer/src/clearHTMLElement";
import { createRouter } from "@personalidol/workers/src/createRouter";

import { LoadingErrorScreen } from "../components/LoadingErrorScreen";
import { LoadingScreen } from "../components/LoadingScreen";
import { MainMenuScreen } from "../components/MainMenuScreen";
import { OptionsSubView } from "../components/OptionsSubView";

import { createUIComponentsRouter } from "./createUIComponentsRouter";
import { createUIStateMessageRoutes } from "./createUIStateMessageRoutes";

import type { DOMUIController as IDOMUIController } from "@personalidol/dom-renderer/src/DOMUIController.interface";

import type { UIState } from "./UIState.type";

export function DOMUIController(domMessagePort: MessagePort, uiRootElement: HTMLElement): IDOMUIController {
  const _uiState: UIState = {
    cMainMenu: {
      enabled: false,
      props: {},
    },
    cLoadingError: {
      enabled: false,
      props: {},
    },
    cLoadingScreen: {
      enabled: false,
      props: {},
    },
    cOptions: {
      enabled: false,
      props: {},
    },
  };

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
    clearHTMLElement(uiRootElement);
    domMessagePort.onmessage = _uiMessageRouter;
  }

  function stop() {
    domMessagePort.onmessage = null;
  }

  function update() {}

  function _render() {
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
