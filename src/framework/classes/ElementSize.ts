import isEqualWithPrecision from "src/framework/helpers/isEqualWithPrecision";

import { ElementSize as ElementSizeInterface } from "src/framework/interfaces/ElementSize";
import { ElementPositionUnit } from "src/framework/types/ElementPositionUnit";

export default class ElementSize<Unit extends ElementPositionUnit> implements ElementSizeInterface<Unit> {
  readonly height: number;
  readonly depth: number;
  readonly width: number;

  constructor(width: number, height: number, depth: number = 0) {
    this.height = height;
    this.depth = depth;
    this.width = width;
  }

  getBaseArea(): number {
    return this.getHeight() * this.getWidth();
  }

  getAspect(): number {
    return this.getWidth() / this.getHeight();
  }

  getDepth(): number {
    return this.depth;
  }

  getHeight(): number {
    return this.height;
  }

  getWidth(): number {
    return this.width;
  }

  isEqual(other: ElementSizeInterface<Unit>): boolean {
    return this.getDepth() === other.getDepth() && this.getHeight() === other.getHeight() && this.getWidth() === other.getWidth();
  }

  isEqualWithPrecision(other: ElementSizeInterface<Unit>, precision: number): boolean {
    return (
      isEqualWithPrecision(this.getDepth(), other.getDepth(), precision) &&
      isEqualWithPrecision(this.getHeight(), other.getHeight(), precision) &&
      isEqualWithPrecision(this.getWidth(), other.getWidth(), precision)
    );
  }
}
