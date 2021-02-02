// import type { Logger } from "loglevel";

import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
// import type { Nameable } from "@personalidol/framework/src/Nameable.interface";
// import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementRenderingContext } from "./DOMElementRenderingContext.interface";
// import type { ReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";

export interface DOMElementView extends HTMLElement, MainLoopUpdatable {
  props: DOMElementProps;
  propsLastUpdate: number;
  renderingContext: null | DOMElementRenderingContext;
  shadow: ShadowRoot;
  viewLastUpdate: number;
}
