// @flow strict

import type { ElementBoundingBox as ElementBoundingBoxInterface } from "../interfaces/ElementBoundingBox";
import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class ElementBoundingBox<Unit: ElementPositionUnit> implements ElementBoundingBoxInterface<Unit> {
  +elementPosition: ElementPosition<Unit>;
  +elementSize: ElementSize<Unit>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, elementPosition: ElementPosition<Unit>, elementSize: ElementSize<Unit>) {
    this.elementPosition = elementPosition;
    this.elementSize = elementSize;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  getElementPosition(): ElementPosition<Unit> {
    return this.elementPosition;
  }

  getElementSize(): ElementSize<Unit> {
    return this.elementSize;
  }
}
