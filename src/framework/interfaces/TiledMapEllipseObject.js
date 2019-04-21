// @flow

import type { TiledMapBlockObject } from "./TiledMapBlockObject";

export interface TiledMapEllipseObject extends TiledMapBlockObject {
  +isEllipse: true;
  +isPolygon: false;
  +isRectangle: false;
}
