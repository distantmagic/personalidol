// @flow

import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { ElementSizeSerializedObject } from "../types/ElementSizeSerializedObject";

export default class ElementSize<Unit: ElementPositionUnit>
  implements ElementSizeInterface<Unit> {
  +height: number;
  +depth: number;
  +width: number;

  constructor(width: number, height: number, depth: number = 0) {
    this.height = height;
    this.depth = depth;
    this.width = width;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): ElementSizeSerializedObject<Unit> {
    return {
      depth: this.getDepth(),
      height: this.getHeight(),
      width: this.getWidth()
    };
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
}
