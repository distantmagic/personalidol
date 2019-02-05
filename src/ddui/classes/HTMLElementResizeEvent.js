// @flow

import type { ClockTick } from "../../framework/interfaces/ClockTick";
import type { HTMLElementResizeEvent as HTMLElementResizeEventInterface } from "../interfaces/HTMLElementResizeEvent";

export default class HTMLElementResizeEvent
  implements HTMLElementResizeEventInterface {
  +height: number;
  +tick: ClockTick;
  +width: number;

  constructor(tick: ClockTick, width: number, height: number) {
    this.height = height;
    this.tick = tick;
    this.width = width;
  }
}
