import * as THREE from "three";

import isEqualWithEpsilon from "src/framework/helpers/isEqualWithEpsilon";
import isEqualWithPrecision from "src/framework/helpers/isEqualWithPrecision";

import type { default as IQuakeBrushHalfSpace } from "src/framework/interfaces/QuakeBrushHalfSpace";

export default class QuakeBrushHalfSpace implements IQuakeBrushHalfSpace {
  readonly texture: string;
  readonly textureRotationAngle: number;
  readonly textureXScale: number;
  readonly textureYScale: number;
  readonly v1: THREE.Vector3;
  readonly v2: THREE.Vector3;
  readonly v3: THREE.Vector3;
  readonly xOffset: number;
  readonly yOffset: number;
  private cachedPlane: null | THREE.Plane = null;

  constructor(
    v1: THREE.Vector3,
    v2: THREE.Vector3,
    v3: THREE.Vector3,
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

  containsPoint(point: THREE.Vector3): boolean {
    const distanceToPoint = this.getPlane().distanceToPoint(point);

    if (this.planeContainsPoint(point, distanceToPoint)) {
      return true;
    }

    // the point is 'in front' of the plane or lies on it
    return distanceToPoint >= 0;
  }

  getPlane(): THREE.Plane {
    const cachedPlane = this.cachedPlane;

    if (cachedPlane) {
      return cachedPlane;
    }

    // THREE's Plane is actually a half-space in Quake map terms
    // const plane = new THREE.Plane();

    // THREE expects points to be in counter-clockwise order
    // https://threejs.org/docs/#api/en/math/Plane.setFromCoplanarPoints
    //
    // Quake map format stores vertices in a clockwise order
    // http://www.gamers.org/dEngine/quake2/Q2DP/Q2DP_Map/Q2DP_Map-2.html
    const plane = new THREE.Plane().setFromCoplanarPoints(this.getPlaneDefiningPoint1(), this.getPlaneDefiningPoint2(), this.getPlaneDefiningPoint3());

    this.cachedPlane = plane;

    return plane;
  }

  getPlaneDefiningPoint1(): THREE.Vector3 {
    return this.v1;
  }

  getPlaneDefiningPoint2(): THREE.Vector3 {
    return this.v2;
  }

  getPlaneDefiningPoint3(): THREE.Vector3 {
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

  isEqual(other: IQuakeBrushHalfSpace): boolean {
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

  planeContainsPoint(point: THREE.Vector3, distanceToPoint?: number): boolean {
    const distance = "number" === typeof distanceToPoint ? distanceToPoint : this.getPlane().distanceToPoint(point);
    // floating point imperfections
    return isEqualWithEpsilon(distance, 0, 0.0001);
  }
}
