import * as THREE from "three";

import isEqualWithPrecision from "src/framework/helpers/isEqualWithPrecision";

import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type { default as IElementPosition } from "src/framework/interfaces/ElementPosition";

export default class ElementPosition<Unit extends ElementPositionUnit> implements IElementPosition<Unit> {
  readonly unit: Unit;
  readonly vector: THREE.Vector3;
  readonly x: number;
  readonly y: number;
  readonly z: number;

  constructor(unit: Unit, x: number, y: number, z: number) {
    this.unit = unit;
    this.vector = new THREE.Vector3(x, y, z);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone(): IElementPosition<Unit> {
    return new ElementPosition<Unit>(this.unit, this.getX(), this.getY(), this.getZ());
  }

  distanceTo(other: IElementPosition<Unit>): number {
    const otherVector = new THREE.Vector3(other.getX(), other.getY(), other.getZ());

    return this.vector.distanceTo(otherVector);
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getZ(): number {
    return this.z;
  }

  isEqual(other: IElementPosition<Unit>): boolean {
    return this.getX() === other.getX() && this.getY() === other.getY() && this.getZ() === other.getZ();
  }

  isEqualWithPrecision(other: IElementPosition<Unit>, precision: number): boolean {
    return (
      isEqualWithPrecision(this.getX(), other.getX(), precision) &&
      isEqualWithPrecision(this.getY(), other.getY(), precision) &&
      isEqualWithPrecision(this.getZ(), other.getZ(), precision)
    );
  }

  offset(other: IElementPosition<Unit>): IElementPosition<Unit> {
    return new ElementPosition<Unit>(this.unit, this.getX() + other.getX(), this.getY() + other.getY(), this.getZ() + other.getZ());
  }
}
