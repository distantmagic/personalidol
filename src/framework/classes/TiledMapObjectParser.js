// @flow

import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import ElementSize from "./ElementSize";
import { default as TiledMapEllipseObject } from "./TiledMapObject/Ellipse";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Ellipse as TiledMapEllipseObjectInterface } from "../interfaces/TiledMapObject/Ellipse";
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
}
