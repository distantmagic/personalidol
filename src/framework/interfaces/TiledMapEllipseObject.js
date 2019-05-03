// @flow

import type { JsonSerializable } from "./JsonSerializable";
import type { TiledMapBlockObject } from "./TiledMapBlockObject";
import type { TiledMapEllipseObjectSerializedObject } from "../types/TiledMapEllipseObjectSerializedObject";

export interface TiledMapEllipseObject extends JsonSerializable<TiledMapEllipseObjectSerializedObject> {
  +isEllipse: true;
  +isPolygon: false;
  +isRectangle: false;

  getTiledMapBlockObject(): TiledMapBlockObject;
}
