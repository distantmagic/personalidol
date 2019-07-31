// @flow

import type { Ellipse as TiledMapEllipseObjectInterface } from "../interfaces/TiledMapObject/Ellipse";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Polygon as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapObject/Polygon";
import type { Rectangle as TiledMapRectangleObjectInterface } from "../interfaces/TiledMapObject/Rectangle";
import type { TiledMapObjectCollection as TiledMapObjectCollectionInterface } from "../interfaces/TiledMapObjectCollection";

export default class TiledMapObjectCollection implements TiledMapObjectCollectionInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  addEllipseObject(tiledMapEllipseObject: TiledMapEllipseObjectInterface): void {
    console.log(tiledMapEllipseObject);
  }

  addRectangleObject(tiledMapRectangleObject: TiledMapRectangleObjectInterface): void {
    console.log(tiledMapRectangleObject);
  }

  addPolygonObject(tiledMapPolygonObject: TiledMapPolygonObjectInterface): void {
    console.log(tiledMapPolygonObject);
  }
}
