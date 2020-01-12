import * as THREE from "three";

import isEqualWithPrecision from "src/framework/helpers/isEqualWithPrecision";

import { ElementPosition as ElementPositionInterface } from "src/framework/interfaces/ElementPosition";
import { ElementPositionUnit } from "src/framework/types/ElementPositionUnit";

export default class ElementPosition<Unit extends ElementPositionUnit> implements ElementPositionInterface<Unit> {
  readonly vector: THREE.Vector3;
  readonly x: number;
  readonly y: number;
  readonly z: number;

  constructor(x: number, y: number, z: number = 0) {
    this.vector = new THREE.Vector3(x, y, z);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone(): ElementPositionInterface<Unit> {
    return new ElementPosition<Unit>(this.getX(), this.getY(), this.getZ());
  }

  distanceTo(other: ElementPositionInterface<Unit>): number {
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

  isOnLineBetween(start: ElementPositionInterface<Unit>, end: ElementPositionInterface<Unit>): boolean {
    return this.distanceTo(start) + this.distanceTo(end) === start.distanceTo(end);
  }

  isEqual(other: ElementPositionInterface<Unit>): boolean {
    return this.getX() === other.getX() && this.getY() === other.getY() && this.getZ() === other.getZ();
  }

  isEqualWithPrecision(other: ElementPositionInterface<Unit>, precision: number): boolean {
    return (
      isEqualWithPrecision(this.getX(), other.getX(), precision) &&
      isEqualWithPrecision(this.getY(), other.getY(), precision) &&
      isEqualWithPrecision(this.getZ(), other.getZ(), precision)
    );
  }

  offset(other: ElementPositionInterface<Unit>): ElementPositionInterface<Unit> {
    return new ElementPosition<Unit>(this.getX() + other.getX(), this.getY() + other.getY(), this.getZ() + other.getZ());
  }
}
