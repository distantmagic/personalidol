// @flow

import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { ElementSpatialUnit } from "../types/ElementSpatialUnit";

export default class ElementPosition<Unit: ElementSpatialUnit>
  implements ElementPositionInterface<Unit> {
  +x: number;
  +y: number;
  +z: number;

  constructor(x: number, y: number, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
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
