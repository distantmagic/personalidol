import { domElementsLookup as baseDomElementsLookup } from "@personalidol/dom-renderer/src/domElementsLookup";

import { FatalErrorDOMElementView } from "./FatalErrorDOMElementView";
import { InGameMenuDOMElementView } from "./InGameMenuDOMElementView";
import { InGameMenuTriggerDOMElementView } from "./InGameMenuTriggerDOMElementView";
import { LoadingScreenDOMElementView } from "./LoadingScreenDOMElementView";
import { MainMenuDOMElementView } from "./MainMenuDOMElementView";
import { MousePointerLayerDOMElementView } from "./MousePointerLayerDOMElementView";
import { ObjectLabelDOMElementView } from "./ObjectLabelDOMElementView";
import { UserSettingsDOMElementView } from "./UserSettingsDOMElementView";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";

export const domElementsLookup: DOMElementsLookup = {
  ...baseDomElementsLookup,

  "pi-fatal-error": FatalErrorDOMElementView,
  "pi-in-game-menu": InGameMenuDOMElementView,
  "pi-in-game-menu-trigger": InGameMenuTriggerDOMElementView,
  "pi-loading-screen": LoadingScreenDOMElementView,
  "pi-main-menu": MainMenuDOMElementView,
  "pi-mouse-pointer-layer": MousePointerLayerDOMElementView,
  "pi-object-label": ObjectLabelDOMElementView,
  "pi-user-settings": UserSettingsDOMElementView,
};
