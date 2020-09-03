import { h, render as preactRender } from "preact";

import { clearHTMLElement } from "@personalidol/dom-renderer/src/clearHTMLElement";
import { createRouter } from "@personalidol/workers/src/createRouter";

import { LoadingErrorScreen } from "../components/LoadingErrorScreen";
import { LoadingScreen } from "../components/LoadingScreen";
import { MainMenuScreen } from "../components/MainMenuScreen";
import { OptionsSubView } from "../components/OptionsSubView";

import { FatalError } from "../elements/pi-fatal-error";
import { LoadingProgress } from "../elements/pi-loading-progress";
import { MainMenu } from "../elements/pi-main-menu";
import { MainMenuButton } from "../elements/pi-main-menu-button";
import { Options } from "../elements/pi-options";

import { createUIRenderingRouter } from "./createUIRenderingRouter";
import { createUIState } from "./createUIState";
import { createUIStateMessageRoutes } from "./createUIStateMessageRoutes";

import type { DOMUIController as IDOMUIController } from "@personalidol/dom-renderer/src/DOMUIController.interface";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";

import type { UIState } from "./UIState.type";

export function DOMUIController(domMessagePort: MessagePort, uiRootElement: HTMLElement): IDOMUIController {
  const state: SceneState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _uiState: UIState = createUIState();
  let _isCleared: boolean = false;
  let _needsUpdate: boolean = false;

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
  });

  const _uiMessageRouter = createRouter(createUIStateMessageRoutes(_uiState), _setNeedsUpdate);

  function dispose() {}

  async function preload() {
    customElements.define("pi-fatal-error", FatalError);
    customElements.define("pi-loading-progress", LoadingProgress);
    customElements.define("pi-main-menu", MainMenu);
    customElements.define("pi-main-menu-button", MainMenuButton);
    customElements.define("pi-options", Options);

    state.isPreloaded = true;
    state.isPreloading = false;
  }

  function mount() {
    state.isMounted = true;

    domMessagePort.onmessage = _uiMessageRouter;
  }

  function unmount() {
    state.isMounted = false;

    domMessagePort.onmessage = null;
  }

  function update() {
    if (!_needsUpdate) {
      return;
    }

    _clearUIRootElement();
    preactRender(_uiRenderingRouter(), uiRootElement);

    _needsUpdate = false;
  }

  function _clearUIRootElement() {
    if (!_isCleared) {
      clearHTMLElement(uiRootElement);
      _isCleared = true;
    }
  }

  function _setNeedsUpdate() {
    _needsUpdate = true;
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
