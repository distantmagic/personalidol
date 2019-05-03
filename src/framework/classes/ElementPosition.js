// @flow

import * as THREE from "three";

import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { ElementPositionSerializedObject } from "../types/ElementPositionSerializedObject";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";

export default class ElementPosition<Unit: ElementPositionUnit>
  extends THREE.Vector3
  implements ElementPositionInterface<Unit> {
  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): ElementPositionSerializedObject<Unit> {
    return {
      x: this.getX(),
      y: this.getY(),
      z: this.getZ()
    };
  }

  clone(): ElementPositionInterface<Unit> {
    return new ElementPosition<Unit>(this.getX(), this.getY(), this.getZ());
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

  isEqual(other: ElementPositionInterface<Unit>): boolean {
    return (
      this.getX() === other.getX() &&
      this.getY() === other.getY() &&
      this.getZ() === other.getZ()
    );
  }
}
