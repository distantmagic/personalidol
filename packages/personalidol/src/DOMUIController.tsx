import { h, render as preactRender } from "preact";

import { clearHTMLElement } from "@personalidol/dom-renderer/src/clearHTMLElement";
import { createRouter } from "@personalidol/workers/src/createRouter";

import { LoadingErrorScreen } from "../components/LoadingErrorScreen";
import { LoadingScreen } from "../components/LoadingScreen";
import { MainMenuScreen } from "../components/MainMenuScreen";
import { OptionsSubView } from "../components/OptionsSubView";
import { WebComponent } from "../components/WebComponent";

import { FatalError } from "../elements/pi-fatal-error";
import { LoadingProgress } from "../elements/pi-loading-progress";
import { MainMenu } from "../elements/pi-main-menu";
import { MainMenuButton } from "../elements/pi-main-menu-button";
import { Options } from "../elements/pi-options";
import { PointerFeedback } from "../elements/pi-pointer-feedback";

import { createUIRenderingRouter } from "./createUIRenderingRouter";
import { createUIState } from "./createUIState";
import { createUIStateMessageRoutes } from "./createUIStateMessageRoutes";

import type { DOMUIController as IDOMUIController } from "@personalidol/dom-renderer/src/DOMUIController.interface";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";

import type { UIState } from "./UIState.type";

export function DOMUIController(dimensionsState: Uint32Array, inputState: Int32Array, domMessagePort: MessagePort, uiRootElement: HTMLElement): IDOMUIController {
  const state: SceneState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _uiState: UIState = createUIState();
  let _isCleared: boolean = false;
  let _needsUpdateComponents: boolean = false;
  let _pointerFeedback: null | PointerFeedback = null;

  const _uiRenderingRouter = createUIRenderingRouter(_uiState, {
    cLoadingError(props) {
      return <LoadingErrorScreen loadingError={props.loadingError} />;
    },

    cLoadingScreen(props) {
      return <LoadingScreen loadingManagerProgress={props.loadingManagerProgress} />;
    },

    cMainMenu() {
      return <MainMenuScreen domMessagePort={domMessagePort} uiState={_uiState} uiStateUpdateCallback={_setNeedsUpdate} />;
    },

    cOptions() {
      return <OptionsSubView domMessagePort={domMessagePort} uiState={_uiState} uiStateUpdateCallback={_setNeedsUpdate} />;
    },

    cPointerFeedback() {
      return <WebComponent uiRootElement={uiRootElement} webComponent={_pointerFeedback} />;
    },
  });

  const _uiMessageRouter = createRouter(createUIStateMessageRoutes(_uiState), _setNeedsUpdate);

  function dispose() {}

  function preload() {
    customElements.define("pi-fatal-error", FatalError);
    customElements.define("pi-loading-progress", LoadingProgress);
    customElements.define("pi-main-menu", MainMenu);
    customElements.define("pi-main-menu-button", MainMenuButton);
    customElements.define("pi-options", Options);
    customElements.define("pi-pointer-feedback", PointerFeedback);

    state.isPreloaded = true;
    state.isPreloading = false;
  }

  function mount() {
    state.isMounted = true;

    domMessagePort.onmessage = _uiMessageRouter;

    _pointerFeedback = document.createElement("pi-pointer-feedback") as PointerFeedback;
    _pointerFeedback.setDimensionsState(dimensionsState);
    _pointerFeedback.setInputState(inputState);
  }

  function unmount() {
    state.isMounted = false;

    domMessagePort.onmessage = null;
  }

  function update() {
    if (_pointerFeedback) {
      _pointerFeedback.update();
    }

    if (!_needsUpdateComponents) {
      return;
    }

    _clearUIRootElement();
    preactRender(_uiRenderingRouter(), uiRootElement);

    _needsUpdateComponents = false;
  }

  function _clearUIRootElement() {
    if (!_isCleared) {
      clearHTMLElement(uiRootElement);
      _isCleared = true;
    }
  }

  function _setNeedsUpdate() {
    _needsUpdateComponents = true;
  }

  return Object.freeze({
    name: "DOMUIController",
    state: state,

    dispose: dispose,
    preload: preload,
    mount: mount,
    unmount: unmount,
    update: update,
  });
}
