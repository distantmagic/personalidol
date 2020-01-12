import * as THREE from "three";
import uniq from "lodash/uniq";

import combineWithoutRepetitions from "../helpers/combineWithoutRepetitions";
import isArrayEqual from "../helpers/isArrayEqual";
import QuakeBrushHalfSpaceTrio from "./QuakeBrushHalfSpaceTrio";
import serializeVector3 from "../helpers/serializeVector3";
import { default as QuakeBrushException } from "./Exception/QuakeBrush";

import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import { QuakeBrush as QuakeBrushInterface } from "../interfaces/QuakeBrush";
import { QuakeBrushHalfSpace } from "../interfaces/QuakeBrushHalfSpace";
import { QuakeBrushHalfSpaceTrio as QuakeBrushHalfSpaceTrioInterface } from "../interfaces/QuakeBrushHalfSpaceTrio";

export default class QuakeBrush implements QuakeBrushInterface {
  readonly halfSpaces: ReadonlyArray<QuakeBrushHalfSpace>;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, halfSpaces: ReadonlyArray<QuakeBrushHalfSpace>) {
    if (halfSpaces.length < 4) {
      throw new QuakeBrushException(loggerBreadcrumbs.add("constructor"), "You need at least 4 half-spaces to have a chance of forming a polyhedron.");
    }

    this.halfSpaces = Object.freeze(halfSpaces);
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  containsPoint(point: THREE.Vector3): boolean {
    for (let halfSpace of this.getHalfSpaces()) {
      if (!halfSpace.containsPoint(point)) {
        return false;
      }
    }

    return true;
  }

  *generateHalfSpaceTrios(): Generator<QuakeBrushHalfSpaceTrioInterface, void, void> {
    for (let combo of combineWithoutRepetitions<QuakeBrushHalfSpace>(this.halfSpaces, 3)) {
      if (combo.length !== 3) {
        throw new QuakeBrushException(this.loggerBreadcrumbs, "Invalid halfspace combinations.");
      }

      yield new QuakeBrushHalfSpaceTrio(this.loggerBreadcrumbs.add("QuakeBrushHalfSpaceTrio"), combo[0], combo[1], combo[2]);
    }
  }

  *generateVertices(): Generator<THREE.Vector3, void, void> {
    const unique: { [key: string]: boolean } = {};

    for (let trio of this.generateHalfSpaceTrios()) {
      if (trio.hasIntersectingPoint()) {
        const intersectingPoint = trio.getIntersectingPoint();
        const serialized = serializeVector3(intersectingPoint);

        if (!unique.hasOwnProperty(serialized)) {
          unique[serialized] = true;

          if (this.containsPoint(intersectingPoint)) {
            yield intersectingPoint;
          }
        }
      }
    }
  }

  getHalfSpaceByCoplanarPoints(v1: THREE.Vector3, v2: THREE.Vector3, v3: THREE.Vector3): QuakeBrushHalfSpace {
    for (let halfSpace of this.getHalfSpaces()) {
      if (halfSpace.planeContainsPoint(v1) && halfSpace.planeContainsPoint(v2) && halfSpace.planeContainsPoint(v3)) {
        return halfSpace;
      }
    }

    throw new QuakeBrushException(this.loggerBreadcrumbs.add("getHalfSpaceByCoplanarPoints"), "Half space does not exist, but it was expected.");
  }

  getHalfSpaces(): ReadonlyArray<QuakeBrushHalfSpace> {
    return this.halfSpaces;
  }

  getTextures(): ReadonlyArray<string> {
    return uniq(this.getHalfSpaces().map(halfSpace => halfSpace.getTexture()));
  }

  getVertices(): ReadonlyArray<THREE.Vector3> {
    return Array.from(this.generateVertices());
  }

  isEqual(other: QuakeBrushInterface): boolean {
    const thisHalfSpaces = this.getHalfSpaces();
    const otherHalfSpaces = other.getHalfSpaces();

    return isArrayEqual(this.loggerBreadcrumbs.add("isEqual"), thisHalfSpaces, otherHalfSpaces);
  }
}
