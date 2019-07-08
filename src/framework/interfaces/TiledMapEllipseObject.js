// @flow

import type { Equatable } from "./Equatable";
import type { TiledMapBlockObject } from "./TiledMapBlockObject";

export interface TiledMapEllipseObject extends Equatable<TiledMapEllipseObject> {
  +isEllipse: true;
  +isPolygon: false;
  +isRectangle: false;

  getTiledMapBlockObject(): TiledMapBlockObject;
}
