// @flow

import type { Ellipse as TiledMapEllipseObject } from "./TiledMapObject/Ellipse";
import type { Polygon as TiledMapPolygonObject } from "./TiledMapObject/Polygon";
import type { Rectangle as TiledMapRectangleObject } from "./TiledMapObject/Rectangle";
import type { TiledMapObjectCollection } from "./TiledMapObjectCollection";

export interface TiledMapObjectLayer {
  addEllipseObject(TiledMapEllipseObject): void;

  addPolygonObject(TiledMapPolygonObject): void;

  addRectangleObject(TiledMapRectangleObject): void;

  getEllipseObjects(): TiledMapObjectCollection<TiledMapEllipseObject>;

  getPolygonObjects(): TiledMapObjectCollection<TiledMapPolygonObject>;

  getRectangleObjects(): TiledMapObjectCollection<TiledMapRectangleObject>;
}
