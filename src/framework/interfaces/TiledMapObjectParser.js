// @flow

import type { Ellipse as TiledMapEllipseObject } from "./TiledMapObject/Ellipse";
import type { Rectangle as TiledMapRectangleObject } from "./TiledMapObject/Rectangle";
import type { Polygon as TiledMapPolygonObject } from "./TiledMapObject/Polygon";

export interface TiledMapObjectParser {
  createEllipseObject(HTMLElement): Promise<TiledMapEllipseObject>;

  createPolygonObject(HTMLElement): Promise<TiledMapPolygonObject>;

  createRectangleObject(HTMLElement): Promise<TiledMapRectangleObject>;
}
