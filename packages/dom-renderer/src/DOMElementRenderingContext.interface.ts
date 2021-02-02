import type { VNode } from "preact";

import type { Nameable } from "@personalidol/framework/src/Nameable.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementRenderingContextState } from "./DOMElementRenderingContextState.type";

export interface DOMElementRenderingContext extends Nameable {
  isPure: boolean;
  state: DOMElementRenderingContextState;

  beforeRender(props: DOMElementProps, propsLastUpdate: number, viewLastUpdate: number): void;

  render(delta: number, elapsedTime: number, tickTimerState: TickTimerState): null | VNode<any>;
}
