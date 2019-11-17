// @flow

import * as THREE from "three";

import * as round from "../helpers/round";

import type { Plane, Vector3 } from "three";

import type { QuakeBrushHalfSpace as QuakeBrushHalfSpaceInterface } from "../interfaces/QuakeBrushHalfSpace";

export default class QuakeBrushHalfSpace implements QuakeBrushHalfSpaceInterface {
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

  getPlane(): Plane {
    // THREE's Plane is actually a half-space in Quake map terms
    const plane = new THREE.Plane();

    // THREE expects points to be in counter-clockwise order
    // https://threejs.org/docs/#api/en/math/Plane.setFromCoplanarPoints
    //
    // Quake map format stores vertices in a clockwise order
    // http://www.gamers.org/dEngine/quake2/Q2DP/Q2DP_Map/Q2DP_Map-2.html
    //
    // to put something in a counter-clockwise order, you need to reverse
    // clockwise elements array and then put the last one in the first plance,
    // so 1,3,2 is not a mistake, it's actually 1,2,3 -> 3,2,1 -> 1,3,2
    return plane.setFromCoplanarPoints(this.getVector1(), this.getVector3(), this.getVector2());
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

  isEqual(other: QuakeBrushHalfSpaceInterface): boolean {
    return (
      this.getVector1().equals(other.getVector1()) &&
      this.getVector2().equals(other.getVector2()) &&
      this.getVector3().equals(other.getVector3()) &&
      this.getTexture() === other.getTexture() &&
      this.getXOffset() === other.getXOffset() &&
      this.getYOffset() === other.getYOffset() &&
      round.isEqualWithPrecision(this.getTextureRotationAngle(), other.getTextureRotationAngle(), 2) &&
      this.getTextureXScale() === other.getTextureXScale() &&
      this.getTextureYScale() === other.getTextureYScale()
    );
  }

  isParallel(other: QuakeBrushHalfSpaceInterface): boolean {
    const thisPlane = this.getPlane();
    const otherPlane = other.getPlane();

    return thisPlane.normal.equals(otherPlane.normal) || thisPlane.normal.multiplyScalar(-1).equals(otherPlane.normal);
  }
}
