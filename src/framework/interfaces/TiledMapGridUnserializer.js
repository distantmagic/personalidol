// @flow

import type { TiledMapGrid } from "./TiledMapGrid";
import type { TiledMapGridSerializedObject } from "../types/TiledMapGridSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledMapGridUnserializer
  extends JsonUnserializable<TiledMapGrid, TiledMapGridSerializedObject> {}
