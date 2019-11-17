// @flow

import * as equality from "../helpers/equality";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush as QuakeBrushInterface } from "../interfaces/QuakeBrush";
import type { QuakeBrushHalfSpace } from "../interfaces/QuakeBrushHalfSpace";

export default class QuakeBrush implements QuakeBrushInterface {
  +halfSpaces: $ReadOnlyArray<QuakeBrushHalfSpace>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, halfSpaces: $ReadOnlyArray<QuakeBrushHalfSpace>) {
    this.halfSpaces = halfSpaces;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
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
