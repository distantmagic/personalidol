// @flow

import * as math from "mathjs";
import * as THREE from "three";

import * as round from "../helpers/round";
import Exception from "./Exception";

import type { Plane, Vector3 } from "three";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrushHalfSpace } from "../interfaces/QuakeBrushHalfSpace";
import type { QuakeBrushHalfSpaceTrio as QuakeBrushHalfSpaceTrioInterface } from "../interfaces/QuakeBrushHalfSpaceTrio";

function checkIntersectingPointDeterminant(det: number): bool {
  // normally it should be enough to check if determinant !== 0, but due to
  // floating point limitations, there is some margin considered
  return !round.isEqualWithEpsilon(det, 0, 0.1);
}

function getIntersectionDeterminant(trio: QuakeBrushHalfSpaceTrioInterface, plane1: Plane, plane2: Plane, plane3: Plane): number {
  const matrix = new THREE.Matrix3();

  matrix.set(...plane1.normal.toArray(), ...plane2.normal.toArray(), ...plane3.normal.toArray());

  return matrix.determinant();
}

export default class QuakeBrushHalfSpaceTrio implements QuakeBrushHalfSpaceTrioInterface {
  +hs1: QuakeBrushHalfSpace;
  +hs2: QuakeBrushHalfSpace;
  +hs3: QuakeBrushHalfSpace;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, hs1: QuakeBrushHalfSpace, hs2: QuakeBrushHalfSpace, hs3: QuakeBrushHalfSpace) {
    this.hs1 = hs1;
    this.hs2 = hs2;
    this.hs3 = hs3;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  getIntersectingPoint(): Vector3 {
    const plane1 = this.getQuakeBrushHalfSpace1().getPlane();
    const plane2 = this.getQuakeBrushHalfSpace2().getPlane();
    const plane3 = this.getQuakeBrushHalfSpace3().getPlane();
    const intersectionDeterminant: number = getIntersectionDeterminant(this, plane1, plane2, plane3);

    if (!this.hasIntersectingPoint(intersectionDeterminant)) {
      throw new Exception(this.loggerBreadcrumbs.add("getIntersectingPoint"), "There is no intersecting point, but it was expected.");
    }

    const xMatrix = new THREE.Matrix3();

    xMatrix.set(plane1.constant, plane1.normal.y, plane1.normal.z, plane2.constant, plane2.normal.y, plane2.normal.z, plane3.constant, plane3.normal.y, plane3.normal.z);

    const yMatrix = new THREE.Matrix3();

    yMatrix.set(plane1.normal.x, plane1.constant, plane1.normal.z, plane2.normal.x, plane2.constant, plane2.normal.z, plane3.normal.x, plane3.constant, plane3.normal.z);

    const zMatrix = new THREE.Matrix3();

    zMatrix.set(plane1.normal.x, plane1.normal.y, plane1.constant, plane2.normal.x, plane2.normal.y, plane2.constant, plane3.normal.x, plane3.normal.y, plane3.constant);

    return new THREE.Vector3(
      math.round(xMatrix.determinant() / (-1 * intersectionDeterminant), 5),
      math.round(yMatrix.determinant() / (-1 * intersectionDeterminant), 5),
      math.round(zMatrix.determinant() / (-1 * intersectionDeterminant), 5)
    );
  }

  getQuakeBrushHalfSpace1(): QuakeBrushHalfSpace {
    return this.hs1;
  }

  getQuakeBrushHalfSpace2(): QuakeBrushHalfSpace {
    return this.hs2;
  }

  getQuakeBrushHalfSpace3(): QuakeBrushHalfSpace {
    return this.hs3;
  }

  hasIntersectingPoint(intersectionDeterminant?: number): boolean {
    if ("number" === typeof intersectionDeterminant) {
      return checkIntersectingPointDeterminant(intersectionDeterminant);
    }

    const plane1 = this.getQuakeBrushHalfSpace1().getPlane();
    const plane2 = this.getQuakeBrushHalfSpace2().getPlane();
    const plane3 = this.getQuakeBrushHalfSpace3().getPlane();

    return checkIntersectingPointDeterminant(getIntersectionDeterminant(this, plane1, plane2, plane3));
  }
}
