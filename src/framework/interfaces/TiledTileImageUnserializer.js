// @flow

import type { TiledTileImage } from "./TiledTileImage";
import type { TiledTileImageSerializedObject } from "../types/TiledTileImageSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledTileImageUnserializer
  extends JsonUnserializable<TiledTileImage, TiledTileImageSerializedObject> {}
