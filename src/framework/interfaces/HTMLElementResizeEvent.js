// @flow

import type { ClockTick } from "../../framework/interfaces/ClockTick";
import type { HTMLElementSize } from "../interfaces/HTMLElementSize";

export interface HTMLElementResizeEvent {
  getHTMLElementSize(): HTMLElementSize;

  getClockTick(): ClockTick;
}
