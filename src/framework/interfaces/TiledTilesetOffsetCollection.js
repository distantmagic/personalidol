// @flow

import type { Equatable } from "./Equatable";
import type { TiledTile } from "./TiledTile";
import type { TiledTilesetOffset } from "./TiledTilesetOffset";

export interface TiledTilesetOffsetCollection extends Equatable<TiledTilesetOffsetCollection> {
  addTiledTilesetOffset(TiledTilesetOffset): void;

  getTiledTileByOffsettedId(number): TiledTile;

  getTiledTilesetOffsets(): Set<TiledTilesetOffset>;

  hasTiledTilesetOffset(TiledTilesetOffset): boolean;
}
