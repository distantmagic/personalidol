// @flow

import type { ElementPosition } from "./ElementPosition";
import type { Equatable } from "./Equatable";
import type { TiledMapPositionedObject } from "./TiledMapPositionedObject";

export interface TiledMapPolygonObject extends Equatable<TiledMapPolygonObject> {
  +isEllipse: false;
  +isPolygon: true;
  +isRectangle: false;

  getDepth(): number;

  getPolygonPoints(): $ReadOnlyArray<ElementPosition<"tile">>;

  getTiledMapPositionedObject(): TiledMapPositionedObject;
}
