import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/workers/src/createRouter";

import { FatalError } from "../elements/pi-fatal-error";
import { LoadingScreen } from "../elements/pi-loading-screen";
import { MainMenu } from "../elements/pi-main-menu";
import { Options } from "../elements/pi-options";

import { createUIRenderingRouter } from "./createUIRenderingRouter";
import { createUIState } from "./createUIState";
import { createUIStateMessageRoutes } from "./createUIStateMessageRoutes";

import type { DOMUIController as IDOMUIController } from "@personalidol/dom-renderer/src/DOMUIController.interface";
import type { MountState } from "@personalidol/framework/src/MountState.type";

import type { UIState } from "./UIState.type";

function _defineCustomElement(name: string, element: typeof HTMLElement): Promise<void> {
  customElements.define(name, element);

  return customElements.whenDefined(name);
}

function _renderNodes(uiRootElement: HTMLElement, nodes: ReadonlyArray<HTMLElement>) {
  // Detach nodes that should not be rendered.
  for (let node of Array.from(uiRootElement.childNodes)) {
    if (!(node instanceof HTMLElement) || !nodes.includes(node)) {
      uiRootElement.removeChild(node);
    }
  }

  // Attach nodes that should be rendered.
  for (let node of nodes) {
    if (!uiRootElement.contains(node)) {
      uiRootElement.appendChild(node);
    }
  }
}

export function DOMUIController(dimensionsState: Uint32Array, inputState: Int32Array, domMessagePort: MessagePort, uiRootElement: HTMLElement): IDOMUIController {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _uiState: UIState = createUIState();

  let _needsUpdateComponents: boolean = false;

  let _fatalError: null | FatalError = null;
  let _loadingScreen: null | LoadingScreen = null;
  let _mainMenu: null | MainMenu = null;
  let _options: null | Options = null;

  const _uiRenderingRouter = createUIRenderingRouter(_uiState, {
    [FatalError.defineName](props) {
      if (!_fatalError) {
        throw new Error(`"${FatalError.defineName}" element is not ready.`);
      }

      _fatalError.loadingError = props.loadingError;

      return _fatalError;
    },

    [LoadingScreen.defineName](props) {
      if (!_loadingScreen) {
        throw new Error(`"${LoadingScreen.defineName}" element is not ready.`);
      }

      _loadingScreen.loadingManagerProgress = props.loadingManagerProgress;

      return _loadingScreen;
    },

    [MainMenu.defineName]() {
      if (!_mainMenu) {
        throw new Error(`"${MainMenu.defineName}" element is not ready.`);
      }

      _mainMenu.domMessagePort = domMessagePort;
      _mainMenu.onUINeedsUpdate = _setNeedsUpdate;
      _mainMenu.uiState = _uiState;

      return _mainMenu;
    },

    [Options.defineName]() {
      if (!_options) {
        throw new Error(`"${Options.defineName}" element is not ready.`);
      }

      _options.onUINeedsUpdate = _setNeedsUpdate;
      _options.uiState = _uiState;

      return _options;
    },
  });

  const _uiMessageRouter = createRouter(createUIStateMessageRoutes(_uiState), _setNeedsUpdate);

  function dispose() {}

  async function preload() {
    state.isPreloading = true;

    await Promise.all([
      _defineCustomElement(FatalError.defineName, FatalError),
      _defineCustomElement(LoadingScreen.defineName, LoadingScreen),
      _defineCustomElement(MainMenu.defineName, MainMenu),
      _defineCustomElement(Options.defineName, Options),
    ]);

    _fatalError = document.createElement(FatalError.defineName) as FatalError;
    _loadingScreen = document.createElement(LoadingScreen.defineName) as LoadingScreen;
    _mainMenu = document.createElement(MainMenu.defineName) as MainMenu;
    _options = document.createElement(Options.defineName) as Options;

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
    if (!_needsUpdateComponents) {
      return;
    }

    _renderNodes(uiRootElement, _uiRenderingRouter());
    _needsUpdateComponents = false;
  }

  function _setNeedsUpdate() {
    _needsUpdateComponents = true;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isScene: true,
    isView: false,
    name: "DOMUIController",
    state: state,

    dispose: dispose,
    preload: preload,
    mount: mount,
    unmount: unmount,
    update: update,
  });
}
