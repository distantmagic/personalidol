import type * as THREE from "three";

import type Equatable from "src/framework/interfaces/Equatable";

export default interface QuakeBrushHalfSpace extends Equatable<QuakeBrushHalfSpace> {
  containsPoint(point: THREE.Vector3): boolean;

  getPlane(): THREE.Plane;

  getPlaneDefiningPoints(): [THREE.Vector3, THREE.Vector3, THREE.Vector3];

  getTexture(): string;

  getTextureRotationAngle(): number;

  getTextureXScale(): number;

  getTextureYScale(): number;

  getXOffset(): number;

  getYOffset(): number;

  planeContainsPoint(point: THREE.Vector3): boolean;
}
