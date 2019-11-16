// @flow

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush as QuakeBrushInterface } from "../interfaces/QuakeBrush";
import type { QuakeBrushHalfSpace } from "../interfaces/QuakeBrushHalfSpace";

export default class QuakeBrush implements QuakeBrushInterface {
  +halfPlanes: $ReadOnlyArray<QuakeBrushHalfSpace>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, halfPlanes: $ReadOnlyArray<QuakeBrushHalfSpace>) {
    this.halfPlanes = halfPlanes;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }
}
