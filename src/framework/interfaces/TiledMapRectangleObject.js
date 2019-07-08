// @flow

import type { Equatable } from "./Equatable";
import type { TiledMapBlockObject } from "./TiledMapBlockObject";

export interface TiledMapRectangleObject extends Equatable<TiledMapRectangleObject> {
  +isEllipse: false;
  +isPolygon: false;
  +isRectangle: true;

  getTiledMapBlockObject(): TiledMapBlockObject;
}
