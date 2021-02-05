import { FatalErrorDOMElementView } from "./FatalErrorDOMElementView";
import { InGameMenuTriggerDOMElementView } from "./InGameMenuTriggerDOMElementView";
import { LoadingScreenDOMElementView } from "./LoadingScreenDOMElementView";
import { MainMenuDOMElementView } from "./MainMenuDOMElementView";
import { ObjectLabelDOMElementView } from "./ObjectLabelDOMElementView";

import type { DOMElementsLookup } from "@personalidol/dom-renderer/src/DOMElementsLookup.type";

export const domElementsLookup: DOMElementsLookup = {
  "pi-fatal-error": FatalErrorDOMElementView,
  "pi-ingame-menu-trigger": InGameMenuTriggerDOMElementView,
  "pi-loading-screen": LoadingScreenDOMElementView,
  "pi-main-menu": MainMenuDOMElementView,
  "pi-object-label": ObjectLabelDOMElementView,
};
