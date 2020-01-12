import { ElementBoundingBox as ElementBoundingBoxInterface } from "src/framework/interfaces/ElementBoundingBox";
import { ElementPosition } from "src/framework/interfaces/ElementPosition";
import { ElementPositionUnit } from "src/framework/types/ElementPositionUnit";
import { ElementSize } from "src/framework/interfaces/ElementSize";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";

export default class ElementBoundingBox<Unit extends ElementPositionUnit> implements ElementBoundingBoxInterface<Unit> {
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
