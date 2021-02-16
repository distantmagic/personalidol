import type { DOMElementsLookup as BaseDOMElementsLookup } from "@personalidol/dom-renderer/src/DOMElementsLookup.type";

import type { FatalErrorDOMElementView } from "./FatalErrorDOMElementView";
import type { InGameMenuDOMElementView } from "./InGameMenuDOMElementView";
import type { InGameMenuTriggerDOMElementView } from "./InGameMenuTriggerDOMElementView";
import type { LoadingScreenDOMElementView } from "./LoadingScreenDOMElementView";
import type { MainMenuDOMElementView } from "./MainMenuDOMElementView";
import type { MousePointerLayerDOMElementView } from "./MousePointerLayerDOMElementView";
import type { ObjectLabelDOMElementView } from "./ObjectLabelDOMElementView";
import type { UserSettingsDOMElementView } from "./UserSettingsDOMElementView";

export type DOMElementsLookup = BaseDOMElementsLookup & {
  "pi-fatal-error": typeof FatalErrorDOMElementView;
  "pi-in-game-menu": typeof InGameMenuDOMElementView;
  "pi-in-game-menu-trigger": typeof InGameMenuTriggerDOMElementView;
  "pi-loading-screen": typeof LoadingScreenDOMElementView;
  "pi-main-menu": typeof MainMenuDOMElementView;
  "pi-mouse-pointer-layer": typeof MousePointerLayerDOMElementView;
  "pi-object-label": typeof ObjectLabelDOMElementView;
  "pi-user-settings": typeof UserSettingsDOMElementView;
};
