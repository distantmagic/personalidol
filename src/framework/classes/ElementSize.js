// @flow

import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { ElementSizeUnit } from "../types/ElementSizeUnit";

export default class ElementSize<Unit: ElementSizeUnit>
  implements ElementSizeInterface<Unit> {
  +height: number;
  +width: number;

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
  }

  getAspect(): number {
    return this.getWidth() / this.getHeight();
  }

  getHeight(): number {
    return this.height;
  }

  getWidth(): number {
    return this.width;
  }

  isEqual(other: ElementSizeInterface<Unit>): boolean {
    return (
      this.getHeight() === other.getHeight() &&
      this.getWidth() === other.getWidth()
    );
  }
}
