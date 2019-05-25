// @flow

import * as THREE from "three";

import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { ElementPositionSerializedObject } from "../types/ElementPositionSerializedObject";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";

export default class ElementPosition<Unit: ElementPositionUnit> implements ElementPositionInterface<Unit> {
  +vector: THREE.Vector3;
  +x: number;
  +y: number;
  +z: number;

  constructor(x: number, y: number, z: number = 0) {
    this.vector = new THREE.Vector3(x, y, z);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): ElementPositionSerializedObject<Unit> {
    return {
      x: this.getX(),
      y: this.getY(),
      z: this.getZ(),
    };
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
}
