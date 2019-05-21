// @flow

import type { TiledMapPolygonObject } from "./TiledMapPolygonObject";
import type { TiledMapPolygonObjectSerializedObject } from "../types/TiledMapPolygonObjectSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledMapPolygonObjectUnserializer
  extends JsonUnserializable<TiledMapPolygonObject, TiledMapPolygonObjectSerializedObject> {}
