import { h, render as preactRender } from "preact";

import { clearHTMLElement } from "@personalidol/dom-renderer/src/clearHTMLElement";
import { createRouter } from "@personalidol/workers/src/createRouter";

import { LoadingErrorScreen } from "../components/LoadingErrorScreen";
import { LoadingScreen } from "../components/LoadingScreen";
import { MainMenuScreen } from "../components/MainMenuScreen";
import { OptionsSubView } from "../components/OptionsSubView";

import { createUIRenderingRouter } from "./createUIRenderingRouter";
import { createUIState } from "./createUIState";
import { createUIStateMessageRoutes } from "./createUIStateMessageRoutes";

import type { DOMUIController as IDOMUIController } from "@personalidol/dom-renderer/src/DOMUIController.interface";

import type { UIState } from "./UIState.type";

export function DOMUIController(domMessagePort: MessagePort, uiRootElement: HTMLElement): IDOMUIController {
  const _uiState: UIState = createUIState();
  let _isCleared: boolean = false;

  const _uiRenderingRouter = createUIRenderingRouter(_uiState, {
    cLoadingError(props) {
      return <LoadingErrorScreen loadingError={props.loadingError} />;
    },

    cLoadingScreen(props) {
      return <LoadingScreen loadingManagerProgress={props.loadingManagerProgress} />;
    },

    cMainMenu() {
      return <MainMenuScreen domMessagePort={domMessagePort} uiState={_uiState} uiStateUpdateCallback={_render} />;
    },

    cOptions() {
      return <OptionsSubView domMessagePort={domMessagePort} uiState={_uiState} uiStateUpdateCallback={_render} />;
    },
  });

  const _uiMessageRouter = createRouter(createUIStateMessageRoutes(_uiState), _render);

  function start() {
    domMessagePort.onmessage = _uiMessageRouter;
  }

  function stop() {
    domMessagePort.onmessage = null;
  }

  function update() {}

  function _clearUIRootElement() {
    if (!_isCleared) {
      clearHTMLElement(uiRootElement);
      _isCleared = true;
    }
  }

  function _render() {
    _clearUIRootElement();
    preactRender(_uiRenderingRouter(), uiRootElement);
  }

  return Object.freeze({
    name: "DOMUIController",

    start: start,
    stop: stop,
    update: update,
  });
}
