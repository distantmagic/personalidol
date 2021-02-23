import { domElementsLookup as baseDomElementsLookup } from "@personalidol/dom-renderer/src/domElementsLookup";

import { ButtonDOMElementView } from "./ButtonDOMElementView";
import { DOMZIndex } from "./DOMZIndex.enum";
import { FatalErrorDOMElementView } from "./FatalErrorDOMElementView";
import { InGameMenuDOMElementView } from "./InGameMenuDOMElementView";
import { InGameMenuTriggerDOMElementView } from "./InGameMenuTriggerDOMElementView";
import { LoadingScreenDOMElementView } from "./LoadingScreenDOMElementView";
import { MainMenuButtonDOMElementView } from "./MainMenuButtonDOMElementView";
import { MainMenuDOMElementView } from "./MainMenuDOMElementView";
import { MainMenuLayoutDOMElementView } from "./MainMenuLayoutDOMElementView";
import { MousePointerLayerDOMElementView } from "./MousePointerLayerDOMElementView";
import { ObjectLabelDOMElementView } from "./ObjectLabelDOMElementView";
import { ReloadButtonDOMElementView } from "./ReloadButtonDOMElementView";
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
  "pi-main-menu-button": MainMenuButtonDOMElementView,
  "pi-main-menu-layout": MainMenuLayoutDOMElementView,
  "pi-mouse-pointer-layer": MousePointerLayerDOMElementView,
  "pi-object-label": ObjectLabelDOMElementView,
  "pi-reload-button": ReloadButtonDOMElementView,
  "pi-slider": SliderDOMElementView,
  "pi-user-settings": UserSettingsDOMElementView,
};
