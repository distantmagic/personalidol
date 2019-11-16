// @flow

import type { Equatable } from "./Equatable";

export interface QuakeBrushHalfSpace extends Equatable<QuakeBrushHalfSpace> {
  getTexture(): string;

  getTextureRotationAngle(): number;

  getTextureXScale(): number;

  getTextureYScale(): number;

  getVector1(): Vector3;

  getVector2(): Vector3;

  getVector3(): Vector3;

  getXOffset(): number;

  getYOffset(): number;
}
