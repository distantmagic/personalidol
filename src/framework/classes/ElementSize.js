// @flow

import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { ElementSizeUnit } from "../types/ElementSizeUnit";

export default class ElementSize<T: ElementSizeUnit>
  implements ElementSizeInterface<T> {
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

  isEqual(other: ElementSizeInterface<T>): boolean {
    return (
      this.getHeight() === other.getHeight() &&
      this.getWidth() === other.getWidth()
    );
  }
}
