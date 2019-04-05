// @flow

import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";

export default class ElementSize implements ElementSizeInterface {
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

  isEqual(other: ElementSizeInterface): boolean {
    return (
      this.getHeight() === other.getHeight() &&
      this.getWidth() === other.getWidth()
    );
  }
}
