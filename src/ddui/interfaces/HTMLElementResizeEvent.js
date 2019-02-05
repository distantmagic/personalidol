// @flow

import type { ClockTick } from "../../framework/interfaces/ClockTick";

export interface HTMLElementResizeEvent {
  +height: number;
  +tick: ClockTick;
  +width: number;
}
