import type { VNode } from "preact";

import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMUpdatesProps } from "./DOMUpdatesProps.interface";
import type { ReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";

export interface DOMElementView extends DOMUpdatesProps, HTMLElement, MainLoopUpdatable {
  domMessagePort: null | MessagePort;
  props: DOMElementProps;
  propsLastUpdate: number;
  styleSheet: null | ReplaceableStyleSheet;
  uiMessagePort: null | MessagePort;
  viewLastUpdate: number;

  needsRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): boolean;

  render(delta: number, elapsedTime: number, tickTimerState: TickTimerState): null | VNode<any>;
}
