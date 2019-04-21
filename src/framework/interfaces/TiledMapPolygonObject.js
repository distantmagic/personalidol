// @flow

import type { ElementPosition } from "./ElementPosition";
import type { TiledMapPositionedObject } from "./TiledMapPositionedObject";

export interface TiledMapPolygonObject extends TiledMapPositionedObject {
  +isEllipse: false;
  +isPolygon: true;
  +isRectangle: false;

  getDepth(): number;

  getPolygonPoints(): Array<ElementPosition<"tile">>;
}
