// @flow

import { default as QuakeMapException } from "./Exception/QuakeMap";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush } from "../interfaces/QuakeBrush";
import type { QuakeEntity as QuakeEntityInterface } from "../interfaces/QuakeEntity";
import type { QuakeEntityProperties } from "../interfaces/QuakeEntityProperties";

export default class QuakeEntity implements QuakeEntityInterface {
  +brush: ?QuakeBrush;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +props: QuakeEntityProperties;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, props: QuakeEntityProperties, brush: ?QuakeBrush) {
    this.brush = brush;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.props = props;
  }

  getBrush(): QuakeBrush {
    const brush = this.brush;

    if (!brush) {
      throw new QuakeMapException(this.loggerBreadcrumbs.add("getBrush"), "Brush is not set, but was expected.");
    }

    return brush;
  }

  getProperties(): QuakeEntityProperties {
    return this.props;
  }

  hasBrush(): boolean {
    return !!this.brush;
  }
}
