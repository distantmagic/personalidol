import type * as THREE from "three";

import type ElementRotationUnit from "src/framework/enums/ElementRotationUnit";

import type ElementRotation from "src/framework/interfaces/ElementRotation";

export default interface PhysicsShape {
  getBoundingBox(): THREE.Box3;

  getInstanceId(): string;

  getPosition(): THREE.Vector3;

  getRotation(): ElementRotation<ElementRotationUnit.Radians>;
}
