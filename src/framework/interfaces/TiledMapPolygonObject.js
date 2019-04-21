// @flow

import type { TiledMapPositionedObject } from "./TiledMapPositionedObject";

export interface TiledMapPolygonObject extends TiledMapPositionedObject {
  +isEllipse: false;
  +isPolygon: true;
  +isRectangle: false;
}
