// @flow

import ElementBoundingBox from "./ElementBoundingBox";
import ElementPosition from "./ElementPosition";
import ElementSize from "./ElementSize";

import type { ElementBoundingBox as ElementBoundingBoxInterface } from "../interfaces/ElementBoundingBox";
import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { ElementPositionCollection as ElementPositionCollectionInterface } from "../interfaces/ElementPositionCollection";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class ElementPositionCollection<Unit: ElementPositionUnit> implements ElementPositionCollectionInterface<Unit> {
  +elementPositions: $ReadOnlyArray<ElementPositionInterface<Unit>>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, elementPositions: $ReadOnlyArray<ElementPositionInterface<Unit>>) {
    this.elementPositions = elementPositions;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  asArray(): $ReadOnlyArray<ElementPositionInterface<Unit>> {
    return this.elementPositions;
  }

  getElementBoundingBox(): ElementBoundingBoxInterface<Unit> {
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
      new ElementPosition<Unit>(minX, minY, minZ),
      new ElementSize<Unit>(maxX - minX, maxY - minY, maxZ - minZ)
    );
  }

  offsetCollection(other: ElementPositionInterface<Unit>): ElementPositionCollectionInterface<Unit> {
    return new ElementPositionCollection(
      this.loggerBreadcrumbs.add("offsetCollection").add("ElementPositionCollection"),
      this.asArray().map(elementPosition => elementPosition.offset(other))
    );
  }
}
