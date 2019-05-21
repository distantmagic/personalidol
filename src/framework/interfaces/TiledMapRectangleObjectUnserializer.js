// @flow

import type { TiledMapRectangleObject } from "./TiledMapRectangleObject";
import type { TiledMapRectangleObjectSerializedObject } from "../types/TiledMapRectangleObjectSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledMapRectangleObjectUnserializer
  extends JsonUnserializable<TiledMapRectangleObject, TiledMapRectangleObjectSerializedObject> {}
