// @flow

import * as angle from "../helpers/angle";
import * as xml from "../helpers/xml";
import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import ElementSize from "./ElementSize";
import { default as TiledMapEllipseObject } from "./TiledMapObject/Ellipse";
import { default as TiledMapPolygonObject } from "./TiledMapObject/Polygon";
import { default as TiledMapRectangleObject } from "./TiledMapObject/Rectangle";

import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { ElementRotation as ElementRotationInterface } from "../interfaces/ElementRotation";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { Ellipse as TiledMapEllipseObjectInterface } from "../interfaces/TiledMapObject/Ellipse";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Polygon as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapObject/Polygon";
import type { Rectangle as TiledMapRectangleObjectInterface } from "../interfaces/TiledMapObject/Rectangle";
import type { TiledMapObjectParser as TiledMapObjectParserInterface } from "../interfaces/TiledMapObjectParser";

export default class TiledMapObjectParser implements TiledMapObjectParserInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  async createEllipseObject(element: HTMLElement): Promise<TiledMapEllipseObjectInterface> {
    // console.log(element);
    const breadcrumbs = this.loggerBreadcrumbs.add("createEllipseObject");

    return new TiledMapEllipseObject(
      breadcrumbs,
      xml.getStringAttribute(breadcrumbs, element, "name"),
      this.getElementPosition(breadcrumbs, element),
      this.getElementRotation(breadcrumbs, element),
      new ElementSize<"tile">(32, 32),
      "source"
    );
  }

  async createPolygonObject(element: HTMLElement): Promise<TiledMapPolygonObjectInterface> {
    // console.log(element);
    const breadcrumbs = this.loggerBreadcrumbs.add("createPolygonObject");

    return new TiledMapPolygonObject(
      breadcrumbs,
      xml.getStringAttribute(breadcrumbs, element, "name"),
      this.getElementPosition(breadcrumbs, element),
      this.getElementRotation(breadcrumbs, element),
      new ElementSize<"tile">(32, 32),
      "source"
    );
  }

  async createRectangleObject(element: HTMLElement): Promise<TiledMapRectangleObjectInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("createRectangleObject");

    return new TiledMapRectangleObject(
      breadcrumbs,
      xml.getStringAttribute(breadcrumbs, element, "name"),
      this.getElementPosition(breadcrumbs, element),
      this.getElementRotation(breadcrumbs, element),
      new ElementSize<"tile">(32, 32),
      "source"
    );
  }

  getElementPosition(breadcrumbs: LoggerBreadcrumbs, element: HTMLElement): ElementPositionInterface<"tile"> {
    return new ElementPosition<"tile">(
      xml.getNumberAttribute(breadcrumbs, element, "x"),
      xml.getNumberAttribute(breadcrumbs, element, "y"),
      xml.getNumberAttribute(breadcrumbs, element, "z", 0)
    );
  }

  getElementRotation(breadcrumbs: LoggerBreadcrumbs, element: HTMLElement): ElementRotationInterface<"radians"> {
    return new ElementRotation<"radians">(0, angle.deg2radians(xml.getNumberAttribute(breadcrumbs, element, "y")), 0);
  }

  getElementSize(breadcrumbs: LoggerBreadcrumbs, element: HTMLElement): ElementSizeInterface<"tile"> {
    return new ElementSize<"tile">(
      xml.getNumberAttribute(breadcrumbs, element, "width"),
      xml.getNumberAttribute(breadcrumbs, element, "height"),
      0
    );
  }
}
