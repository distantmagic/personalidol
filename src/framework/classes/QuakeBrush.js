// @flow

import isArrayEqual from "../helpers/isArrayEqual";
import combineWithoutRepetitions from "../helpers/combineWithoutRepetitions";

import Exception from "./Exception";
import QuakeBrushHalfSpaceTrio from "./QuakeBrushHalfSpaceTrio";
import { default as vector3serialize } from "../helpers/serialize/vector3";

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
      throw new Exception(loggerBreadcrumbs.add("constructor"), "You need at least 4 half-spaces to have a chance of forming a polyhedron.");
    }

    this.halfSpaces = Object.freeze(halfSpaces);
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  *generateHalfSpaceTrios(): Generator<QuakeBrushHalfSpaceTrioInterface, void, void> {
    for (let combo of combineWithoutRepetitions(this.halfSpaces, 3)) {
      yield new QuakeBrushHalfSpaceTrio(this.loggerBreadcrumbs.add("QuakeBrushHalfSpaceTrio"), ...combo);
    }
  }

  getHalfSpaces(): $ReadOnlyArray<QuakeBrushHalfSpace> {
    return this.halfSpaces;
  }

  *generateVertices(): Generator<Vector3, void, void> {
    const unique: { [string]: boolean } = {};

    for (let trio of this.generateHalfSpaceTrios()) {
      if (trio.hasIntersectingPoint()) {
        const intersectingPoint = trio.getIntersectingPoint();
        const serialized = vector3serialize(intersectingPoint);

        if (!unique.hasOwnProperty(serialized)) {
          unique[serialized] = true;

          if (this.hasPoint(intersectingPoint)) {
            yield intersectingPoint;
          }
        }
      }
    }
  }

  getVertices(): $ReadOnlyArray<Vector3> {
    return Array.from(this.generateVertices());
  }

  hasPoint(point: Vector3): boolean {
    for (let halfSpace of this.getHalfSpaces()) {
      if (!halfSpace.hasPoint(point)) {
        return false;
      }
    }

    return true;
  }

  isEqual(other: QuakeBrushInterface): boolean {
    const thisHalfSpaces = this.getHalfSpaces();
    const otherHalfSpaces = other.getHalfSpaces();

    return isArrayEqual(this.loggerBreadcrumbs.add("isEqual"), thisHalfSpaces, otherHalfSpaces);
  }
}
