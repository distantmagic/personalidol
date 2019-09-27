// @flow

import * as dmmath from "../helpers/dmmath";

import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";

export default class ElementSize<Unit: ElementPositionUnit> implements ElementSizeInterface<Unit> {
  +height: number;
  +depth: number;
  +width: number;

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
    return (
      this.getDepth() === other.getDepth() &&
      this.getHeight() === other.getHeight() &&
      this.getWidth() === other.getWidth()
    );
  }

  isEqualWithPrecision(other: ElementSizeInterface<Unit>, precision: number): boolean {
    return (
      dmmath.isEqualWithPrecision(this.getDepth(), other.getDepth(), precision) &&
      dmmath.isEqualWithPrecision(this.getHeight(), other.getHeight(), precision) &&
      dmmath.isEqualWithPrecision(this.getWidth(), other.getWidth(), precision)
    );
  }
}
