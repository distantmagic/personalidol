import * as THREE from "three";

import ElementRotation from "src/framework/classes/ElementRotation";

import ElementRotationUnit from "src/framework/enums/ElementRotationUnit";

import type QuakeBrush from "src/framework/interfaces/QuakeBrush";
import type { default as IElementRotation } from "src/framework/interfaces/ElementRotation";
import type { default as IPhysicsShape } from "src/framework/interfaces/PhysicsShape";

export default class PhysicsShape implements IPhysicsShape {
  readonly brush: QuakeBrush;
  private instanceId: string;

  constructor(instanceNamespace: string, brush: QuakeBrush) {
    this.brush = brush;
    this.instanceId = `${instanceNamespace}.${THREE.MathUtils.generateUUID()}`;
  }

  getBoundingBox(): THREE.Box3 {
    return this.brush.getBoundingBox();
  }

  getInstanceId(): string {
    return this.instanceId;
  }

  getPosition(): THREE.Vector3 {
    return this.getBoundingBox().min;
  }

  getRotation(): IElementRotation<ElementRotationUnit.Radians> {
    return new ElementRotation<ElementRotationUnit.Radians>(ElementRotationUnit.Radians, 0, 0, 0);
  }
}
