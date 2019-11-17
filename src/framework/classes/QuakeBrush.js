// @flow

import * as equality from "../helpers/equality";

import QuakeBrushHalfSpaceTrio from "./QuakeBrushHalfSpaceTrio";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush as QuakeBrushInterface } from "../interfaces/QuakeBrush";
import type { QuakeBrushHalfSpace } from "../interfaces/QuakeBrushHalfSpace";
import type { QuakeBrushHalfSpaceTrio as QuakeBrushHalfSpaceTrioInterface } from "../interfaces/QuakeBrushHalfSpaceTrio";

function combineWithoutRepetitions(
  comboOptions: $ReadOnlyArray<QuakeBrushHalfSpace>,
  comboLength: number
): $ReadOnlyArray<$ReadOnlyArray<QuakeBrushHalfSpace>> {
  // If the length of the combination is 1 then each element of the original array
  // is a combination itself.
  if (comboLength === 1) {
    return comboOptions.map(comboOption => [comboOption]);
  }

  // Init combinations array.
  const combos = [];

  // Extract characters one by one and concatenate them to combinations of smaller lengths.
  // We need to extract them because we don't want to have repetitions after concatenation.
  comboOptions.forEach((currentOption, optionIndex) => {
    // Generate combinations of smaller size.
    const smallerCombos = combineWithoutRepetitions(comboOptions.slice(optionIndex + 1), comboLength - 1);

    // Concatenate currentOption with all combinations of smaller size.
    smallerCombos.forEach(smallerCombo => {
      combos.push([currentOption].concat(smallerCombo));
    });
  });

  return combos;
}

export default class QuakeBrush implements QuakeBrushInterface {
  +halfSpaces: $ReadOnlyArray<QuakeBrushHalfSpace>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, halfSpaces: $ReadOnlyArray<QuakeBrushHalfSpace>) {
    this.halfSpaces = Object.freeze(halfSpaces);
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  *generateHalfSpaceTrios(): Generator<QuakeBrushHalfSpaceTrioInterface, void, void> {
    const combos = combineWithoutRepetitions(this.halfSpaces, 3);

    for (let combo of combos) {
      yield new QuakeBrushHalfSpaceTrio(...combo);
    }
  }

  getHalfSpaces(): $ReadOnlyArray<QuakeBrushHalfSpace> {
    return this.halfSpaces;
  }

  isEqual(other: QuakeBrushInterface): boolean {
    const thisHalfSpaces = this.getHalfSpaces();
    const otherHalfSpaces = other.getHalfSpaces();

    return equality.isArrayEqual(thisHalfSpaces, otherHalfSpaces);
  }
}
