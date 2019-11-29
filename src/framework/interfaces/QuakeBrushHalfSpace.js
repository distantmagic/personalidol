// @flow

import type { Plane, Vector3 } from "three";

import type { Equatable } from "./Equatable";

export interface QuakeBrushHalfSpace extends Equatable<QuakeBrushHalfSpace> {
  getPlane(): Plane;

  getRandomPoint(): Vector3;

  getRandomVector(Vector3): Vector3;

  getTexture(): string;

  getTextureRotationAngle(): number;

  getTextureXScale(): number;

  getTextureYScale(): number;

  getVector1(): Vector3;

  getVector2(): Vector3;

  getVector3(): Vector3;

  getXOffset(): number;

  getYOffset(): number;

  hasPoint(Vector3): boolean;

  isParallel(QuakeBrushHalfSpace): boolean;
}
