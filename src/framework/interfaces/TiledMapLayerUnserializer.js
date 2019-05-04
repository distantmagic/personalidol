// @flow

import type { TiledMapLayer } from "./TiledMapLayer";
import type { TiledMapLayerSerializedObject } from "../types/TiledMapLayerSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledMapLayerUnserializer
  extends JsonUnserializable<TiledMapLayer, TiledMapLayerSerializedObject> {}
