// @flow

import TiledMapObjectCollection from "./TiledMapObjectCollection";

import type { Ellipse as TiledMapEllipseObjectInterface } from "../interfaces/TiledMapObject/Ellipse";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Polygon as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapObject/Polygon";
import type { Rectangle as TiledMapRectangleObjectInterface } from "../interfaces/TiledMapObject/Rectangle";
import type { TiledMapObjectCollection as TiledMapObjectCollectionInterface } from "../interfaces/TiledMapObjectCollection";
import type { TiledMapObjectLayer as TiledMapObjectLayerInterface } from "../interfaces/TiledMapObjectLayer";

export default class TiledMapObjectLayer implements TiledMapObjectLayerInterface {
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

  getEllipseObjects(): TiledMapObjectCollectionInterface<TiledMapEllipseObjectInterface> {
    return new TiledMapObjectCollection<TiledMapEllipseObjectInterface>(this.tiledMapEllipseObjects);
  }

  getPolygonObjects(): TiledMapObjectCollectionInterface<TiledMapPolygonObjectInterface> {
    return new TiledMapObjectCollection<TiledMapPolygonObjectInterface>(this.tiledMapPolygonObjects);
  }

  getRectangleObjects(): TiledMapObjectCollectionInterface<TiledMapRectangleObjectInterface> {
    return new TiledMapObjectCollection<TiledMapRectangleObjectInterface>(this.tiledMapRectangleObjects);
  }
}
