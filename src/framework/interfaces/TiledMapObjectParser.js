// @flow

import type { CancelToken } from "./CancelToken";
import type { Ellipse as TiledMapEllipseObject } from "./TiledMapObject/Ellipse";
import type { Rectangle as TiledMapRectangleObject } from "./TiledMapObject/Rectangle";
import type { Polygon as TiledMapPolygonObject } from "./TiledMapObject/Polygon";

export interface TiledMapObjectParser {
  createEllipseObject(CancelToken, HTMLElement): Promise<TiledMapEllipseObject>;

  createPolygonObject(CancelToken, HTMLElement): Promise<TiledMapPolygonObject>;

  createRectangleObject(CancelToken, HTMLElement): Promise<TiledMapRectangleObject>;
}
