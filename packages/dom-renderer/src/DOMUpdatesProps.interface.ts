import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DOMElementProps } from "./DOMElementProps.type";

export interface DOMUpdatesProps {
  updateProps(props: DOMElementProps, tickTimerState: TickTimerState): void;
}
