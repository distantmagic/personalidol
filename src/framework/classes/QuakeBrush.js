// @flow

import * as equality from "../helpers/equality";
import combineWithoutRepetitions from "../helpers/combineWithoutRepetitions";

import Exception from "./Exception";
import QuakeBrushHalfSpaceTrio from "./QuakeBrushHalfSpaceTrio";

import type { Vector3 } from "three";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush as QuakeBrushInterface } from "../interfaces/QuakeBrush";
import type { QuakeBrushHalfSpace } from "../interfaces/QuakeBrushHalfSpace";
import type { QuakeBrushHalfSpaceTrio as QuakeBrushHalfSpaceTrioInterface } from "../interfaces/QuakeBrushHalfSpaceTrio";

function vectorToString(vector: Vector3): string {
  return vector.toArray().join("/");
}

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
      yield new QuakeBrushHalfSpaceTrio(
        this.loggerBreadcrumbs.add("QuakeBrushHalfSpaceTrio"),
        ...combo
      );
    }
  }

  getHalfSpaces(): $ReadOnlyArray<QuakeBrushHalfSpace> {
    return this.halfSpaces;
  }

  *generateVertices(): Generator<Vector3, void, void> {
    const unique: {
      [string]: boolean,
    } = {};

    outer: for (let trio of this.generateHalfSpaceTrios()) {
      if (trio.hasIntersectingPoint()) {
        const intersectingPoint = trio.getIntersectingPoint();
        const pointAsString = vectorToString(intersectingPoint);

        if (!unique.hasOwnProperty(pointAsString)) {
          unique[pointAsString] = true;
          yield intersectingPoint;
        }
      }
    }
  }

  getVertices(): $ReadOnlyArray<Vector3> {
    return Array.from(this.generateVertices());
  }

  isEqual(other: QuakeBrushInterface): boolean {
    const thisHalfSpaces = this.getHalfSpaces();
    const otherHalfSpaces = other.getHalfSpaces();

    return equality.isArrayEqual(thisHalfSpaces, otherHalfSpaces);
  }
}
