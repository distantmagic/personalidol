// @flow

import type { TiledMapBlockObject } from "./TiledMapBlockObject";

export interface TiledMapRectangleObject extends TiledMapBlockObject {
  +isEllipse: false;
  +isPolygon: false;
  +isRectangle: true;
}
