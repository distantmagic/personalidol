// @flow

import * as equality from "../helpers/equality";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeEntity } from "../interfaces/QuakeEntity";
import type { QuakeMap as QuakeMapInterface } from "../interfaces/QuakeMap";

export default class QuakeMap implements QuakeMapInterface {
  +entities: $ReadOnlyArray<QuakeEntity>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, entities: $ReadOnlyArray<QuakeEntity>) {
    this.entities = entities;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  getEntities(): $ReadOnlyArray<QuakeEntity> {
    return this.entities;
  }

  isEqual(other: QuakeMapInterface): boolean {
    const thisEntities = this.getEntities();
    const otherEntities = other.getEntities();

    return equality.isArrayEqual(thisEntities, otherEntities);
  }
}
