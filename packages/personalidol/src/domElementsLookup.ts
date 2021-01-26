import { FatalErrorDOMElementView } from "./FatalErrorDOMElementView";
import { LoadingScreenDOMElementView } from "./LoadingScreenDOMElementView";
import { MainMenuDOMElementView } from "./MainMenuDOMElementView";

import type { DOMElementsLookup } from "@personalidol/dom-renderer/src/DOMElementsLookup.type";

export const domElementsLookup: DOMElementsLookup = {
  "pi-fatal-error": FatalErrorDOMElementView,
  "pi-loading-screen": LoadingScreenDOMElementView,
  "pi-main-menu": MainMenuDOMElementView,
};
