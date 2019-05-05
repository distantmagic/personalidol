// @flow

import type { ElementPosition } from "./ElementPosition";
import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledMapPolygonObjectSerializedObject } from "../types/TiledMapPolygonObjectSerializedObject";
import type { TiledMapPositionedObject } from "./TiledMapPositionedObject";

export interface TiledMapPolygonObject
  extends Equatable<TiledMapPolygonObject>,
    JsonSerializable<TiledMapPolygonObjectSerializedObject> {
  +isEllipse: false;
  +isPolygon: true;
  +isRectangle: false;

  getDepth(): number;

  getPolygonPoints(): Array<ElementPosition<"tile">>;

  getTiledMapPositionedObject(): TiledMapPositionedObject;
}
