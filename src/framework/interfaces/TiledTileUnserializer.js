// @flow

import type { TiledTile } from "./TiledTile";
import type { TiledTileSerializedObject } from "../types/TiledTileSerializedObject";
import type { JsonUnserializable } from "./JsonUnserializable";

export interface TiledTileUnserializer extends JsonUnserializable<TiledTile, TiledTileSerializedObject> {}
