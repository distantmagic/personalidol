import isEqualWithPrecision from "src/framework/helpers/isEqualWithPrecision";

import type ElementRotationUnit from "src/framework/enums/ElementRotationUnit";

import type { default as IElementRotation } from "src/framework/interfaces/ElementRotation";

export default class ElementRotation<Unit extends ElementRotationUnit> implements IElementRotation<Unit> {
  readonly unit: Unit;
  readonly x: number;
  readonly y: number;
  readonly z: number;

  constructor(unit: Unit, x: number, y: number, z: number) {
    this.unit = unit;
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

  isEqual(other: IElementRotation<Unit>): boolean {
    return this.getRotationX() === other.getRotationX() && this.getRotationY() === other.getRotationY() && this.getRotationZ() === other.getRotationZ();
  }

  isEqualWithPrecision(other: IElementRotation<Unit>, precision: number): boolean {
    return (
      isEqualWithPrecision(this.getRotationX(), other.getRotationX(), precision) &&
      isEqualWithPrecision(this.getRotationY(), other.getRotationY(), precision) &&
      isEqualWithPrecision(this.getRotationZ(), other.getRotationZ(), precision)
    );
  }
}
