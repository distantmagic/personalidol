// @flow

import type { TiledMapEllipseObject } from "./TiledMapEllipseObject";
import type { TiledMapEllipseObjectSerializedObject } from "../types/TiledMapEllipseObjectSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledMapEllipseObjectUnserializer
  extends JsonUnserializable<TiledMapEllipseObject, TiledMapEllipseObjectSerializedObject> {}
