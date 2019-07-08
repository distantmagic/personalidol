// @flow

import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { TiledTile } from "./TiledTile";

export interface TiledTileset extends Equatable<TiledTileset> {
  add(TiledTile): void;

  getExpectedTileCount(): number;

  getTileById(id: number): TiledTile;

  getTileSize(): ElementSize<"px">;

  getTiles(): Set<TiledTile>;

  hasTileWithId(number): boolean;
}
