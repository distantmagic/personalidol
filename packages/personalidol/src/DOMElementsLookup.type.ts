import type { DOMElementsLookup as BaseDOMElementsLookup } from "@personalidol/dom-renderer/src/DOMElementsLookup.type";

import type { ButtonDOMElementView } from "./ButtonDOMElementView";
import type { FatalErrorDOMElementView } from "./FatalErrorDOMElementView";
import type { InGameMenuDOMElementView } from "./InGameMenuDOMElementView";
import type { InGameMenuTriggerDOMElementView } from "./InGameMenuTriggerDOMElementView";
import type { LoadingScreenDOMElementView } from "./LoadingScreenDOMElementView";
import type { MainMenuButtonDOMElementView } from "./MainMenuButtonDOMElementView";
import type { MainMenuDOMElementView } from "./MainMenuDOMElementView";
import type { MainMenuLayoutDOMElementView } from "./MainMenuLayoutDOMElementView";
import type { MousePointerLayerDOMElementView } from "./MousePointerLayerDOMElementView";
import type { ObjectLabelDOMElementView } from "./ObjectLabelDOMElementView";
import type { ReloadButtonDOMElementView } from "./ReloadButtonDOMElementView";
import type { SliderDOMElementProps } from "./SliderDOMElementProps.interface";
import type { SliderDOMElementView } from "./SliderDOMElementView";
import type { UserSettingsDOMElementView } from "./UserSettingsDOMElementView";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "pi-button": HTMLAttributes<ButtonDOMElementView>;
      "pi-main-menu-button": HTMLAttributes<MainMenuButtonDOMElementView>;
      "pi-main-menu-layout": HTMLAttributes<MainMenuLayoutDOMElementView>;
      "pi-reload-button": HTMLAttributes<ReloadButtonDOMElementView>;
      "pi-slider": HTMLAttributes<SliderDOMElementView<any>> & SliderDOMElementProps<any>;
    }
  }
}

export type DOMElementsLookup = BaseDOMElementsLookup & {
  "pi-button": typeof ButtonDOMElementView;
  "pi-fatal-error": typeof FatalErrorDOMElementView;
  "pi-in-game-menu": typeof InGameMenuDOMElementView;
  "pi-in-game-menu-trigger": typeof InGameMenuTriggerDOMElementView;
  "pi-loading-screen": typeof LoadingScreenDOMElementView;
  "pi-main-menu": typeof MainMenuDOMElementView;
  "pi-main-menu-button": typeof MainMenuButtonDOMElementView;
  "pi-main-menu-layout": typeof MainMenuLayoutDOMElementView;
  "pi-mouse-pointer-layer": typeof MousePointerLayerDOMElementView;
  "pi-object-label": typeof ObjectLabelDOMElementView;
  "pi-reload-button": typeof ReloadButtonDOMElementView;
  "pi-slider": typeof SliderDOMElementView;
  "pi-user-settings": typeof UserSettingsDOMElementView;
};
