// @flow

import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import ElementSize from "./ElementSize";
import { default as TiledMapEllipseObject } from "./TiledMapObject/Ellipse";
import { default as TiledMapPolygonObject } from "./TiledMapObject/Polygon";
import { default as TiledMapRectangleObject } from "./TiledMapObject/Rectangle";

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
    console.log(element);
    const breadcrumbs = this.loggerBreadcrumbs.add("createEllipseObject");

    return new TiledMapEllipseObject(
      breadcrumbs,
      "test",
      new ElementPosition<"tile">(0, 0, 0),
      new ElementRotation<"radians">(0, 0, 0),
      new ElementSize<"tile">(32, 32),
      "source"
    );
  }

  async createPolygonObject(element: HTMLElement): Promise<TiledMapPolygonObjectInterface> {
    console.log(element);
    const breadcrumbs = this.loggerBreadcrumbs.add("createPolygonObject");

    return new TiledMapPolygonObject(
      breadcrumbs,
      "test",
      new ElementPosition<"tile">(0, 0, 0),
      new ElementRotation<"radians">(0, 0, 0),
      new ElementSize<"tile">(32, 32),
      "source"
    );
  }

  async createRectangleObject(element: HTMLElement): Promise<TiledMapRectangleObjectInterface> {
    console.log(element);
    const breadcrumbs = this.loggerBreadcrumbs.add("createRectangleObject");

    return new TiledMapRectangleObject(
      breadcrumbs,
      "test",
      new ElementPosition<"tile">(0, 0, 0),
      new ElementRotation<"radians">(0, 0, 0),
      new ElementSize<"tile">(32, 32),
      "source"
    );
  }
}
