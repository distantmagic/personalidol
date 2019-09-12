// @flow

import type { Ellipse as TiledMapEllipseObjectInterface } from "../interfaces/TiledMapObject/Ellipse";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Polygon as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapObject/Polygon";
import type { Rectangle as TiledMapRectangleObjectInterface } from "../interfaces/TiledMapObject/Rectangle";
import type { TiledMapObjectCollection as TiledMapObjectCollectionInterface } from "../interfaces/TiledMapObjectCollection";

export default class TiledMapObjectCollection implements TiledMapObjectCollectionInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiledMapEllipseObjects: Array<TiledMapEllipseObjectInterface>;
  +tiledMapRectangleObjects: Array<TiledMapRectangleObjectInterface>;
  +tiledMapPolygonObjects: Array<TiledMapPolygonObjectInterface>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiledMapEllipseObjects = [];
    this.tiledMapPolygonObjects = [];
    this.tiledMapRectangleObjects = [];
  }

  addEllipseObject(tiledMapEllipseObject: TiledMapEllipseObjectInterface): void {
    this.tiledMapEllipseObjects.push(tiledMapEllipseObject);
  }

  addPolygonObject(tiledMapPolygonObject: TiledMapPolygonObjectInterface): void {
    this.tiledMapPolygonObjects.push(tiledMapPolygonObject);
  }

  addRectangleObject(tiledMapRectangleObject: TiledMapRectangleObjectInterface): void {
    this.tiledMapRectangleObjects.push(tiledMapRectangleObject);
  }

  getEllipseObjects(): $ReadOnlyArray<TiledMapEllipseObjectInterface> {
    return this.tiledMapEllipseObjects;
  }

  getPolygonObjects(): $ReadOnlyArray<TiledMapPolygonObjectInterface> {
    return this.tiledMapPolygonObjects;
  }

  getRectangleObjects(): $ReadOnlyArray<TiledMapRectangleObjectInterface> {
    return this.tiledMapRectangleObjects;
  }
}
