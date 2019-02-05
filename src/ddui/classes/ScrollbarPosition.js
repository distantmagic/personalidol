// @flow

import clamp from "clamp";

export default class ScrollbarPosition {
  +scrollWidth: number;
  +offsetWidth: number;
  +scrollLeft: number;

  constructor(scrollWidth: number, offsetWidth: number, scrollLeft: number) {
    this.scrollWidth = scrollWidth;
    this.offsetWidth = offsetWidth;
    this.scrollLeft = scrollLeft;
  }

  adjust(delta: number): ScrollbarPosition {
    return new ScrollbarPosition(
      this.scrollWidth,
      this.offsetWidth,
      clamp(this.scrollLeft + delta, 0, this.scrollWidth - this.offsetWidth)
    );
  }
}
