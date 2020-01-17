import ElementPosition from "src/framework/interfaces/ElementPosition";
import ElementSize from "src/framework/interfaces/ElementSize";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IElementBoundingBox } from "src/framework/interfaces/ElementBoundingBox";

import ElementPositionUnit from "src/framework/types/ElementPositionUnit";

export default class ElementBoundingBox<Unit extends ElementPositionUnit> implements IElementBoundingBox<Unit> {
  readonly elementPosition: ElementPosition<Unit>;
  readonly elementSize: ElementSize<Unit>;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

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
