// @flow

import type { Ellipse as TiledMapEllipseObject } from "./TiledMapObject/Ellipse";
import type { Rectangle as TiledMapRectangleObject } from "./TiledMapObject/Rectangle";
import type { Polygon as TiledMapPolygonObject } from "./TiledMapObject/Polygon";

export interface TiledMapObjectLayer {
  addEllipseObject(TiledMapEllipseObject): void;

  addPolygonObject(TiledMapPolygonObject): void;

  addRectangleObject(TiledMapRectangleObject): void;

  getEllipseObjects(): $ReadOnlyArray<TiledMapEllipseObject>;

  getPolygonObjects(): $ReadOnlyArray<TiledMapPolygonObject>;

  getRectangleObjects(): $ReadOnlyArray<TiledMapRectangleObject>;
}
