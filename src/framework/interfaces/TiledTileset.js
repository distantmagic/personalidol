// @flow

import type { ElementSize } from "./ElementSize";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledTile } from "./TiledTile";
import type { TiledTilesetSerializedObject } from "../types/TiledTilesetSerializedObject";

export interface TiledTileset
  extends JsonSerializable<TiledTilesetSerializedObject> {
  add(TiledTile): void;

  getExpectedTileCount(): number;

  getTileById(id: number): TiledTile;

  getTileSize(): ElementSize<"px">;

  getTiles(): Set<TiledTile>;
}
