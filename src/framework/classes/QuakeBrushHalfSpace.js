// @flow

import * as THREE from "three";

import isEqualWithEpsilon from "../helpers/isEqualWithEpsilon";
import isEqualWithPrecision from "../helpers/isEqualWithPrecision";

import type { Plane, Vector3 } from "three";

import type { QuakeBrushHalfSpace as QuakeBrushHalfSpaceInterface } from "../interfaces/QuakeBrushHalfSpace";

export default class QuakeBrushHalfSpace implements QuakeBrushHalfSpaceInterface {
  +texture: string;
  +textureRotationAngle: number;
  +textureXScale: number;
  +textureYScale: number;
  +v1: Vector3;
  +v2: Vector3;
  +v3: Vector3;
  +xOffset: number;
  +yOffset: number;
  cachedPlane: ?Plane;

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

  containsPoint(point: Vector3): boolean {
    const distanceToPoint = this.getPlane().distanceToPoint(point);

    if (this.planeContainsPoint(point, distanceToPoint)) {
      return true;
    }

    // the point is 'in front' of the plane or lies on it
    return distanceToPoint >= 0;
  }

  getPlane(): Plane {
    const cachedPlane = this.cachedPlane;

    if (cachedPlane)  {
      return cachedPlane;
    }

    // THREE's Plane is actually a half-space in Quake map terms
    // const plane = new THREE.Plane();

    // THREE expects points to be in counter-clockwise order
    // https://threejs.org/docs/#api/en/math/Plane.setFromCoplanarPoints
    //
    // Quake map format stores vertices in a clockwise order
    // http://www.gamers.org/dEngine/quake2/Q2DP/Q2DP_Map/Q2DP_Map-2.html
    const plane = (new THREE.Plane()).setFromCoplanarPoints(this.getPlaneDefiningPoint1(), this.getPlaneDefiningPoint2(), this.getPlaneDefiningPoint3());

    this.cachedPlane = plane;

    return plane;
  }

  getPlaneDefiningPoint1(): Vector3 {
    return this.v1;
  }

  getPlaneDefiningPoint2(): Vector3 {
    return this.v2;
  }

  getPlaneDefiningPoint3(): Vector3 {
    return this.v3;
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

  getXOffset(): number {
    return this.xOffset;
  }

  getYOffset(): number {
    return this.yOffset;
  }

  isEqual(other: QuakeBrushHalfSpaceInterface): boolean {
    return (
      this.getPlaneDefiningPoint1().equals(other.getPlaneDefiningPoint1()) &&
      this.getPlaneDefiningPoint2().equals(other.getPlaneDefiningPoint2()) &&
      this.getPlaneDefiningPoint3().equals(other.getPlaneDefiningPoint3()) &&
      this.getTexture() === other.getTexture() &&
      this.getXOffset() === other.getXOffset() &&
      this.getYOffset() === other.getYOffset() &&
      isEqualWithPrecision(this.getTextureRotationAngle(), other.getTextureRotationAngle(), 2) &&
      this.getTextureXScale() === other.getTextureXScale() &&
      this.getTextureYScale() === other.getTextureYScale()
    );
  }

  planeContainsPoint(point: Vector3, distanceToPoint?: number): boolean {
    const distance = "number" === typeof distanceToPoint
      ? distanceToPoint
      : this.getPlane().distanceToPoint(point)
    ;

    // floating point imperfections
    return isEqualWithEpsilon(distance, 0, 0.0001);
  }
}
