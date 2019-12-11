// @flow

import uniq from "lodash/uniq";

import combineWithoutRepetitions from "../helpers/combineWithoutRepetitions";
import isArrayEqual from "../helpers/isArrayEqual";
import QuakeBrushHalfSpaceTrio from "./QuakeBrushHalfSpaceTrio";
import serializeVector3 from "../helpers/serializeVector3";
import { default as QuakeBrushException } from "./Exception/QuakeBrush";

import type { Vector3 } from "three";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush as QuakeBrushInterface } from "../interfaces/QuakeBrush";
import type { QuakeBrushHalfSpace } from "../interfaces/QuakeBrushHalfSpace";
import type { QuakeBrushHalfSpaceTrio as QuakeBrushHalfSpaceTrioInterface } from "../interfaces/QuakeBrushHalfSpaceTrio";

export default class QuakeBrush implements QuakeBrushInterface {
  +halfSpaces: $ReadOnlyArray<QuakeBrushHalfSpace>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, halfSpaces: $ReadOnlyArray<QuakeBrushHalfSpace>) {
    if (halfSpaces.length < 4) {
      throw new QuakeBrushException(loggerBreadcrumbs.add("constructor"), "You need at least 4 half-spaces to have a chance of forming a polyhedron.");
    }

    this.halfSpaces = Object.freeze(halfSpaces);
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  containsPoint(point: Vector3): boolean {
    for (let halfSpace of this.getHalfSpaces()) {
      if (!halfSpace.containsPoint(point)) {
        return false;
      }
    }

    return true;
  }

  *generateHalfSpaceTrios(): Generator<QuakeBrushHalfSpaceTrioInterface, void, void> {
    for (let combo of combineWithoutRepetitions(this.halfSpaces, 3)) {
      yield new QuakeBrushHalfSpaceTrio(this.loggerBreadcrumbs.add("QuakeBrushHalfSpaceTrio"), ...combo);
    }
  }

  *generateVertices(): Generator<Vector3, void, void> {
    const unique: { [string]: boolean } = {};

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

  getHalfSpaceByCopolarPoints(v1: Vector3, v2: Vector3, v3: Vector3): QuakeBrushHalfSpace {
    for (let halfSpace of this.getHalfSpaces()) {
      if (halfSpace.planeContainsPoint(v1) && halfSpace.planeContainsPoint(v2) && halfSpace.planeContainsPoint(v3)) {
        return halfSpace;
      }
    }

    throw new QuakeBrushException(this.loggerBreadcrumbs.add("getHalfSpaceByCopolarPoints"), "Half space does not exist, but it was expected.");
  }

  getHalfSpaces(): $ReadOnlyArray<QuakeBrushHalfSpace> {
    return this.halfSpaces;
  }

  getTextures(): $ReadOnlyArray<string> {
    return uniq(this.getHalfSpaces().map(halfSpace => halfSpace.getTexture()));
  }

  getVertices(): $ReadOnlyArray<Vector3> {
    return Array.from(this.generateVertices());
  }

  isEqual(other: QuakeBrushInterface): boolean {
    const thisHalfSpaces = this.getHalfSpaces();
    const otherHalfSpaces = other.getHalfSpaces();

    return isArrayEqual(this.loggerBreadcrumbs.add("isEqual"), thisHalfSpaces, otherHalfSpaces);
  }
}
