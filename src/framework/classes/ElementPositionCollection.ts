import ElementBoundingBox from "src/framework/classes/ElementBoundingBox";
import ElementPosition from "src/framework/classes/ElementPosition";
import ElementSize from "src/framework/classes/ElementSize";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IElementBoundingBox } from "src/framework/interfaces/ElementBoundingBox";
import { default as IElementPosition } from "src/framework/interfaces/ElementPosition";
import { default as IElementPositionCollection } from "src/framework/interfaces/ElementPositionCollection";

import ElementPositionUnit from "src/framework/types/ElementPositionUnit";

export default class ElementPositionCollection<Unit extends ElementPositionUnit> implements HasLoggerBreadcrumbs, IElementPositionCollection<Unit> {
  readonly elementPositions: ReadonlyArray<IElementPosition<Unit>>;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly unit: Unit;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, unit: Unit, elementPositions: ReadonlyArray<IElementPosition<Unit>>) {
    this.elementPositions = elementPositions;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.unit = unit;
  }

  asArray(): ReadonlyArray<IElementPosition<Unit>> {
    return this.elementPositions;
  }

  getElementBoundingBox(): IElementBoundingBox<Unit> {
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    let maxZ = Number.MIN_VALUE;

    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let minZ = Number.MAX_VALUE;

    this.asArray().forEach(elementPosition => {
      const elementX = elementPosition.getX();
      const elementY = elementPosition.getY();
      const elementZ = elementPosition.getZ();

      if (minX > elementX) {
        minX = elementX;
      }
      if (maxX < elementX) {
        maxX = elementX;
      }

      if (minY > elementY) {
        minY = elementY;
      }
      if (maxY < elementY) {
        maxY = elementY;
      }

      if (minZ > elementZ) {
        minZ = elementZ;
      }
      if (maxZ < elementZ) {
        maxZ = elementZ;
      }
    });

    return new ElementBoundingBox(
      this.loggerBreadcrumbs.add("ElementBoundingBox"),
      new ElementPosition<Unit>(this.unit, minX, minY, minZ),
      new ElementSize<Unit>(this.unit, maxX - minX, maxY - minY, maxZ - minZ)
    );
  }

  offsetCollection(other: IElementPosition<Unit>): IElementPositionCollection<Unit> {
    return new ElementPositionCollection(
      this.loggerBreadcrumbs.add("offsetCollection").add("ElementPositionCollection"),
      this.unit,
      this.asArray().map(elementPosition => elementPosition.offset(other))
    );
  }
}
