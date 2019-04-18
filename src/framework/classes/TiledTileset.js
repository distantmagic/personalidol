// @flow

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledTile } from "../interfaces/TiledTile";
import type { TiledTileset as TiledTilesetInterface } from "../interfaces/TiledTileset";

export default class TiledTileset implements TiledTilesetInterface {
  +expectedTileCount: number;
  +tiles: Map<string, TiledTile>;
  +tileSize: ElementSize;

  constructor(expectedTileCount: number, tileSize: ElementSize): void {
    this.expectedTileCount = expectedTileCount;
    this.tiles = new Map<string, TiledTile>();
    this.tileSize = tileSize;
  }

  add(tile: TiledTile): void {
    this.tiles.set(tile.getId(), tile);
  }

  getTileById(id: string): TiledTile {
    const tile = this.tiles.get(id);

    if (!tile) {
      throw new Error(`Tile not found: "${id}".`);
    }

    return tile;
  }

  getTiles(): Set<TiledTile> {
    return new Set(this.tiles.values());
  }
}
