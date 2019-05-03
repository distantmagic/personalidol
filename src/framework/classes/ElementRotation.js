// @flow

import type { ElementRotation as ElementRotationInterface } from "../interfaces/ElementRotation";
import type { ElementRotationSerializedObject } from "../types/ElementRotationSerializedObject";
import type { ElementRotationUnit } from "../types/ElementRotationUnit";

export default class ElementRotation<Unit: ElementRotationUnit>
  implements ElementRotationInterface<Unit> {
  +x: number;
  +y: number;
  +z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): ElementRotationSerializedObject<Unit> {
    return {
      x: this.getRotationX(),
      y: this.getRotationY(),
      z: this.getRotationZ()
    };
  }

  getRotationX(): number {
    return this.x;
  }

  getRotationY(): number {
    return this.y;
  }

  getRotationZ(): number {
    return this.z;
  }

  isEqual(other: ElementRotationInterface<Unit>): boolean {
    return (
      this.getRotationX() === other.getRotationX() &&
      this.getRotationY() === other.getRotationY() &&
      this.getRotationZ() === other.getRotationZ()
    );
  }
}
