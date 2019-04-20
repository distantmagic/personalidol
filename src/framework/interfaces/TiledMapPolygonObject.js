// @flow

import type { TiledMapObject } from "./TiledMapObject";

export interface TiledMapPolygonObject extends TiledMapObject {
  // isEllipse: false;
  isPolygon: true;
  // isRectangel: false;
}
