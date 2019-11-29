// @flow

import type { Plane, Vector3 } from "three";

import type { Equatable } from "./Equatable";

export interface QuakeBrushHalfSpace extends Equatable<QuakeBrushHalfSpace> {
  getPlane(): Plane;

  getPlaneDefiningPoint1(): Vector3;

  getPlaneDefiningPoint2(): Vector3;

  getPlaneDefiningPoint3(): Vector3;

  getRandomPoint(): Vector3;

  getRandomVector(Vector3): Vector3;

  getTexture(): string;

  getTextureRotationAngle(): number;

  getTextureXScale(): number;

  getTextureYScale(): number;

  getXOffset(): number;

  getYOffset(): number;

  hasPoint(Vector3): boolean;

  isParallel(QuakeBrushHalfSpace): boolean;
}
