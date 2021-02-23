import { domElementsLookup as baseDomElementsLookup } from "@personalidol/dom-renderer/src/domElementsLookup";

import { ButtonDOMElementView } from "./ButtonDOMElementView";
import { DOMZIndex } from "./DOMZIndex.enum";
import { FatalErrorDOMElementView } from "./FatalErrorDOMElementView";
import { InGameMenuDOMElementView } from "./InGameMenuDOMElementView";
import { InGameMenuTriggerDOMElementView } from "./InGameMenuTriggerDOMElementView";
import { LoadingScreenDOMElementView } from "./LoadingScreenDOMElementView";
import { MainMenuDOMElementView } from "./MainMenuDOMElementView";
import { MousePointerLayerDOMElementView } from "./MousePointerLayerDOMElementView";
import { ObjectLabelDOMElementView } from "./ObjectLabelDOMElementView";
import { SliderDOMElementView } from "./SliderDOMElementView";
import { UserSettingsDOMElementView } from "./UserSettingsDOMElementView";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";

baseDomElementsLookup["pi-stats-reporter"].zIndex = DOMZIndex.StatsReporter;

export const domElementsLookup: DOMElementsLookup = {
  ...baseDomElementsLookup,

  "pi-button": ButtonDOMElementView,
  "pi-fatal-error": FatalErrorDOMElementView,
  "pi-in-game-menu": InGameMenuDOMElementView,
  "pi-in-game-menu-trigger": InGameMenuTriggerDOMElementView,
  "pi-loading-screen": LoadingScreenDOMElementView,
  "pi-main-menu": MainMenuDOMElementView,
  "pi-mouse-pointer-layer": MousePointerLayerDOMElementView,
  "pi-object-label": ObjectLabelDOMElementView,
  "pi-slider": SliderDOMElementView,
  "pi-user-settings": UserSettingsDOMElementView,
};
