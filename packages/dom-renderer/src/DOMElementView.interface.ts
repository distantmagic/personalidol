import type { Logger } from "loglevel";
import type { VNode } from "preact";

import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Nameable } from "@personalidol/framework/src/Nameable.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { ReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";

export interface DOMElementView extends HTMLElement, MainLoopUpdatable {
  domMessagePort: null | MessagePort;
  logger: null | Logger;
  nameable: Nameable;
  needsRender: boolean;
  props: DOMElementProps;
  propsLastUpdate: number;
  styleSheet: null | ReplaceableStyleSheet;
  tickTimerState: null | TickTimerState;
  uiMessagePort: null | MessagePort;
  viewLastUpdate: number;

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void;

  /**
   * Init has to be used, because HTMLElement constructor does not take
   * arguments.
   */
  init(logger: Logger, domMessagePort: MessagePort, uiMessagePort: MessagePort, tickTimerState: TickTimerState): void;

  render(): null | VNode<any>;

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void;
}
