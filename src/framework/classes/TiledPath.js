// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledPath as TiledPathInterface } from "../interfaces/TiledPath";

export default class TiledPath<T: ElementPositionUnit> implements TiledPathInterface<T> {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +steps: Array<ElementPosition<T>>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.steps = [];
  }

  addStep(elementPosition: ElementPosition<T>): void {
    this.steps.push(elementPosition);
  }

  getSteps(): $ReadOnlyArray<ElementPosition<T>> {
    return this.steps.slice(0);
  }

  isEqual(other: TiledPathInterface<T>): boolean {
    const thisSteps = this.getSteps();
    const otherSteps = other.getSteps();

    if (thisSteps.length !== otherSteps.length) {
      return false;
    }

    for (let i = 0; i < thisSteps.length; i += 1) {
      if (!thisSteps[i].isEqual(otherSteps[i])) {
        return false;
      }
    }

    return true;
  }
}
