import clamp from "lodash/clamp";

export default class ScrollbarPosition {
  readonly changed: boolean;
  readonly scrollLength: number;
  readonly offsetLength: number;
  readonly scrollIndicatorHeight: number;
  readonly scrollOffset: number;
  readonly scrollPercentage: number;

  constructor(scrollLength: number, offsetLength: number, scrollIndicatorHeight: number, scrollOffset: number, changed: boolean = false) {
    this.changed = changed;
    this.offsetLength = offsetLength;
    this.scrollIndicatorHeight = scrollIndicatorHeight;
    this.scrollLength = scrollLength;
    this.scrollOffset = scrollOffset;

    this.scrollPercentage = Math.round((scrollOffset / (scrollLength - offsetLength)) * 100);
  }

  adjust(delta: number): ScrollbarPosition {
    const updatedScrollOffset = clamp(this.scrollOffset + delta, 0, this.scrollLength - this.offsetLength);

    return new ScrollbarPosition(this.scrollLength, this.offsetLength, this.scrollIndicatorHeight, updatedScrollOffset, updatedScrollOffset !== this.scrollOffset);
  }

  isChanged(): boolean {
    return this.changed;
  }
}
