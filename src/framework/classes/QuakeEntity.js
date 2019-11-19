// @flow

import * as equality from "../helpers/equality";
import { default as QuakeMapException } from "./Exception/QuakeMap";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush } from "../interfaces/QuakeBrush";
import type { QuakeEntity as QuakeEntityInterface } from "../interfaces/QuakeEntity";
import type { QuakeEntityProperties } from "../interfaces/QuakeEntityProperties";

export default class QuakeEntity implements QuakeEntityInterface {
  +brushes: $ReadOnlyArray<QuakeBrush>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +props: QuakeEntityProperties;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, props: QuakeEntityProperties, brushes: $ReadOnlyArray<QuakeBrush> = []) {
    this.brushes = brushes;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.props = props;
  }

  getBrushes(): $ReadOnlyArray<QuakeBrush> {
    return this.brushes;
  }

  getProperties(): QuakeEntityProperties {
    return this.props;
  }

  isEqual(other: QuakeEntityInterface): boolean {
    if (!this.getProperties().isEqual(other.getProperties())) {
      return false;
    }

    return equality.isArrayEqual(this.getBrushes(), other.getBrushes());
  }
}
