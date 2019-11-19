// @flow

import * as equality from "../helpers/equality";

import Exception from "./Exception";
import QuakeBrushHalfSpaceTrio from "./QuakeBrushHalfSpaceTrio";

import type { Vector3 } from "three";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush as QuakeBrushInterface } from "../interfaces/QuakeBrush";
import type { QuakeBrushHalfSpace } from "../interfaces/QuakeBrushHalfSpace";
import type { QuakeBrushHalfSpaceTrio as QuakeBrushHalfSpaceTrioInterface } from "../interfaces/QuakeBrushHalfSpaceTrio";

function* combineWithoutRepetitions(
  comboOptions: $ReadOnlyArray<QuakeBrushHalfSpace>,
  comboLength: number
): Generator<$ReadOnlyArray<QuakeBrushHalfSpace>, void, void> {
  if (comboLength === 1) {
    for (let currentOption of comboOptions) {
      yield [currentOption];
    }
  }

  for (let optionIndex = 0; optionIndex < comboOptions.length; optionIndex += 1) {
    const currentOption: QuakeBrushHalfSpace = comboOptions[optionIndex];
    const smallerCombos = combineWithoutRepetitions(comboOptions.slice(optionIndex + 1), comboLength - 1);

    for (let smallerCombo of smallerCombos) {
      yield [currentOption, ...smallerCombo];
    }
  }
}

export default class QuakeBrush implements QuakeBrushInterface {
  +halfSpaces: $ReadOnlyArray<QuakeBrushHalfSpace>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, halfSpaces: $ReadOnlyArray<QuakeBrushHalfSpace>) {
    if (halfSpaces.length < 4) {
      throw new Exception(
        loggerBreadcrumbs,
        "You need at least 4 half-spaces to have a chance of forming a polyhedron."
      );
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
    for (let trio of this.generateHalfSpaceTrios()) {
      if (trio.hasIntersectingPoint()) {
        yield trio.getIntersectingPoint();
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
