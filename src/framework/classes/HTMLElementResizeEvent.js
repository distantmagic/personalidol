// @flow

import type { ClockTick } from "../interfaces/ClockTick";
import type { HTMLElementResizeEvent as HTMLElementResizeEventInterface } from "../interfaces/HTMLElementResizeEvent";
import type { HTMLElementSize } from "../interfaces/HTMLElementSize";

export default class HTMLElementResizeEvent
  implements HTMLElementResizeEventInterface {
  +htmlElementSize: HTMLElementSize;
  +tick: ClockTick;

  constructor(tick: ClockTick, htmlElementSize: HTMLElementSize) {
    this.htmlElementSize = htmlElementSize;
    this.tick = tick;
  }

  getClockTick(): ClockTick {
    return this.tick;
  }

  getHTMLElementSize(): HTMLElementSize {
    return this.htmlElementSize;
  }
}
