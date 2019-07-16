// @flow

import type { Ellipse as TiledMapEllipseObject } from "./TiledMapObject/Ellipse";
import type { Rectangle as TiledMapRectangleObject } from "./TiledMapObject/Rectangle";
import type { Polygon as TiledMapPolygonObject } from "./TiledMapObject/Polygon";

export interface TiledMapObjectCollection {
  addEllipseObject(TiledMapEllipseObject): void;
  addRectangleObject(TiledMapRectangleObject): void;
  addPolygonObject(TiledMapPolygonObject): void;
}
