// @flow

import type { TiledMapBlockObject } from "./TiledMapBlockObject";
import type { TiledMapBlockObjectSerializedObject } from "../types/TiledMapBlockObjectSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledMapBlockObjectUnserializer
  extends JsonUnserializable<TiledMapBlockObject, TiledMapBlockObjectSerializedObject> {}
