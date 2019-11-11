// @flow

import * as round from "../helpers/round";

import type { ElementRotation as ElementRotationInterface } from "../interfaces/ElementRotation";
import type { ElementRotationUnit } from "../types/ElementRotationUnit";

export default class ElementRotation<Unit: ElementRotationUnit> implements ElementRotationInterface<Unit> {
  +x: number;
  +y: number;
  +z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
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

  isEqualWithPrecision(other: ElementRotationInterface<Unit>, precision: number): boolean {
    return (
      round.isEqualWithPrecision(this.getRotationX(), other.getRotationX(), precision) &&
      round.isEqualWithPrecision(this.getRotationY(), other.getRotationY(), precision) &&
      round.isEqualWithPrecision(this.getRotationZ(), other.getRotationZ(), precision)
    );
  }
}
