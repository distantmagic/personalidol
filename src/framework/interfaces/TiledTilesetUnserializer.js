// @flow

import type { TiledTileset } from "./TiledTileset";
import type { TiledTilesetSerializedObject } from "../types/TiledTilesetSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledTilesetUnserializer
  extends JsonUnserializable<TiledTileset, TiledTilesetSerializedObject> {}
