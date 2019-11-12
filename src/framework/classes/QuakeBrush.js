// @flow

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush as QuakeBrushInterface } from "../interfaces/QuakeBrush";
import type { QuakeBrushHalfPlane } from "../interfaces/QuakeBrushHalfPlane";

export default class QuakeBrush implements QuakeBrushInterface {
  +halfPlanes: $ReadOnlyArray<QuakeBrushHalfPlane>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, halfPlanes: $ReadOnlyArray<QuakeBrushHalfPlane>) {
    this.halfPlanes = halfPlanes;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }
}
