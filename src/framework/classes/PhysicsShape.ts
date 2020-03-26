import * as THREE from "three";

import ElementPosition from "src/framework/classes/ElementPosition";
import ElementRotation from "src/framework/classes/ElementRotation";
import ElementSize from "src/framework/classes/ElementSize";

import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";
import ElementRotationUnit from "src/framework/enums/ElementRotationUnit";

import type QuakeBrush from "src/framework/interfaces/QuakeBrush";
import type { default as IElementPosition } from "src/framework/interfaces/ElementPosition";
import type { default as IElementRotation } from "src/framework/interfaces/ElementRotation";
import type { default as IElementSize } from "src/framework/interfaces/ElementSize";
import type { default as IPhysicsShape } from "src/framework/interfaces/PhysicsShape";

export default class PhysicsShape implements IPhysicsShape {
  readonly brush: QuakeBrush;
  readonly origin: THREE.Vector3;
  private readonly _size: THREE.Vector3 = new THREE.Vector3();

  constructor(origin: THREE.Vector3, brush: QuakeBrush) {
    this.brush = brush;
    this.origin = origin;
  }

  getOrigin(): IElementPosition<ElementPositionUnit.Px> {
    return new ElementPosition<ElementPositionUnit.Px>(ElementPositionUnit.Px, this.origin.x, this.origin.y, this.origin.z);
  }

  getRotation(): IElementRotation<ElementRotationUnit.Radians> {
    return new ElementRotation<ElementRotationUnit.Radians>(ElementRotationUnit.Radians, 0, 0, 0);
  }

  getSize(): IElementSize<ElementPositionUnit.Px> {
    this.brush.getBoundingBox().getSize(this._size);

    return new ElementSize<ElementPositionUnit.Px>(ElementPositionUnit.Px, this._size.x, this._size.y, this._size.z);
  }
}
