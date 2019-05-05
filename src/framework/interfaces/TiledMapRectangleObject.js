// @flow

import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledMapBlockObject } from "./TiledMapBlockObject";
import type { TiledMapRectangleObjectSerializedObject } from "../types/TiledMapRectangleObjectSerializedObject";

export interface TiledMapRectangleObject
  extends Equatable<TiledMapRectangleObject>,
    JsonSerializable<TiledMapRectangleObjectSerializedObject> {
  +isEllipse: false;
  +isPolygon: false;
  +isRectangle: true;

  getTiledMapBlockObject(): TiledMapBlockObject;
}
