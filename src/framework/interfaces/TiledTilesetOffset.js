// @flow

import type { Equatable } from "./Equatable";
import type { TiledTile } from "./TiledTile";
import type { TiledTileset } from "./TiledTileset";

export interface TiledTilesetOffset extends Equatable<TiledTilesetOffset> {
  getActualTiledTileId(number): number;

  getTilesetFirstId(): number;

  getTiledTileByOffsettedId(number): TiledTile;

  getTiledTileset(): TiledTileset;

  hasTiledTileOffsetedId(number): boolean;
}
