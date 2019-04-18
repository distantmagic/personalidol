// @flow

import type { ElementSize } from "./ElementSize";
import type { TiledTile } from "./TiledTile";

export interface TiledTileset {
  constructor(expectedTileCount: number, tileSize: ElementSize): void;

  add(TiledTile): void;

  getTileById(id: string): TiledTile;

  getTiles(): Set<TiledTile>;
}
