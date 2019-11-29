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
    // const plane = new THREE.Plane();

    // THREE expects points to be in counter-clockwise order
    // https://threejs.org/docs/#api/en/math/Plane.setFromCoplanarPoints
    //
    // Quake map format stores vertices in a clockwise order
    // http://www.gamers.org/dEngine/quake2/Q2DP/Q2DP_Map/Q2DP_Map-2.html

    const p1 = this.getVector1();
    const p2 = this.getVector2();
    const p3 = this.getVector3();

    const v1 = p2.clone().sub(p1);
    const v2 = p3.clone().sub(p1);

    const normal = v1
      .clone()
      .cross(v2)
      .normalize();
    const constant = -1 * normal.dot(p3);

    return new THREE.Plane(normal, constant);
  }

  getRandomPoint(): Vector3 {
    const point = this.getVector1();
    const target = new THREE.Vector3(0, 0, 0);

    this.getPlane().projectPoint(point, target);

    return target;
  }

  getRandomVector(point: Vector3): Vector3 {
    const randomPoint = this.getRandomPoint();

    return point.clone().sub(randomPoint);
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
    return this.v1.clone();
  }

  getVector2(): Vector3 {
    return this.v2.clone();
  }

  getVector3(): Vector3 {
    return this.v3.clone();
  }

  getXOffset(): number {
    return this.xOffset;
  }

  getYOffset(): number {
    return this.yOffset;
  }

  hasPoint(point: Vector3): boolean {
    const randomVector = this.getRandomVector(point);
    const dotProduct = this.getPlane().normal.dot(randomVector);

    // floating point imperfections
    if (round.isEqualWithEpsilon(dotProduct, 0, 0.1)) {
      return true;
    }

    // the point is 'in front' of the plane or lies on it
    return dotProduct >= 0;
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
