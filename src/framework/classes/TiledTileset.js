// @flow

import { default as TiledTilesetException } from "./Exception/Tiled/Tileset";

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledTile } from "../interfaces/TiledTile";
import type { TiledTileset as TiledTilesetInterface } from "../interfaces/TiledTileset";

export default class TiledTileset implements TiledTilesetInterface {
  +expectedTileCount: number;
  +tiles: Map<number, TiledTile>;
  +tileSize: ElementSize<"px">;

  constructor(expectedTileCount: number, tileSize: ElementSize<"px">): void {
    this.expectedTileCount = expectedTileCount;
    this.tiles = new Map<number, TiledTile>();
    this.tileSize = tileSize;
  }

  add(tile: TiledTile): void {
    this.tiles.set(tile.getId(), tile);
  }

  getTileById(id: number): TiledTile {
    const tile = this.tiles.get(id);

    if (!tile) {
      throw new TiledTilesetException(`Tile not found: "${id}".`);
    }

    return tile;
  }

  getTiles(): Set<TiledTile> {
    return new Set(this.tiles.values());
  }
}
