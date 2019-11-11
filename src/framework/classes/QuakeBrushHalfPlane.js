// @flow

import * as round from "../helpers/round";

import type { Vector3 } from "three";

import type { QuakeBrushHalfPlane as QuakeBrushHalfPlaneInterface } from "../interfaces/QuakeBrushHalfPlane";

export default class QuakeBrushHalfPlane implements QuakeBrushHalfPlaneInterface {
  +v1: Vector3;
  +v2: Vector3;
  +v3: Vector3;
  +texture: string;
  +xOffset: number;
  +yOffset: number;
  +textureRotationAngle: number;
  +textureXScale: number;
  +textureYScale: number;

  constructor(
    v1: Vector3,
    v2: Vector3,
    v3: Vector3,
    // texture
    texture: string,
    // Texture x-offset (must be multiple of 16)
    xOffset: number,
    // Texture y-offset (must be multiple of 16)
    yOffset: number,
    // floating point value indicating texture rotation
    textureRotationAngle: number,
    // scales x-dimension of texture (negative value to flip)
    textureXScale: number,
    // scales y-dimension of texture (negative value to flip)
    textureYScale: number
  ) {
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
    this.texture = texture;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.textureRotationAngle = textureRotationAngle;
    this.textureXScale = textureXScale;
    this.textureYScale = textureYScale;
  }

  getTexture(): string {
    return this.texture;
  }

  getTextureRotationAngle(): number {
    return this.textureRotationAngle;
  }

  getTextureXScale(): number {
    return this.textureXScale;
  }

  getTextureYScale(): number {
    return this.textureYScale;
  }

  getVector1(): Vector3 {
    return this.v1;
  }

  getVector2(): Vector3 {
    return this.v2;
  }

  getVector3(): Vector3 {
    return this.v3;
  }

  getXOffset(): number {
    return this.xOffset;
  }

  getYOffset(): number {
    return this.yOffset;
  }

  isEqual(other: QuakeBrushHalfPlaneInterface): boolean {
    return (
      this.getVector1().equals(other.getVector1()) &&
      this.getVector2().equals(other.getVector2()) &&
      this.getVector3().equals(other.getVector3()) &&
      this.getTexture() === other.getTexture() &&
      this.getXOffset() === other.getXOffset() &&
      this.getYOffset() === other.getYOffset() &&
      round.isEqualWithPrecision(this.getTextureRotationAngle(), other.getTextureRotationAngle(), -2) &&
      this.getTextureXScale() === other.getTextureXScale() &&
      this.getTextureYScale() === other.getTextureYScale()
    );
  }
}
