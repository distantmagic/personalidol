// @flow

import { default as TiledTilesetException } from "./Exception/Tiled/Tileset";

import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledTile } from "../interfaces/TiledTile";
import type { TiledTileset as TiledTilesetInterface } from "../interfaces/TiledTileset";

export default class TiledTileset implements TiledTilesetInterface {
  +expectedTileCount: number;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiles: Map<number, TiledTile>;
  +tileSize: ElementSize<"px">;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    expectedTileCount: number,
    tileSize: ElementSize<"px">
  ): void {
    this.expectedTileCount = expectedTileCount;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiles = new Map<number, TiledTile>();
    this.tileSize = tileSize;
  }

  add(tile: TiledTile): void {
    this.tiles.set(tile.getId(), tile);
  }

  getTileById(id: number): TiledTile {
    const tile = this.tiles.get(id);

    if (!tile) {
      throw new TiledTilesetException(
        this.loggerBreadcrumbs.add("getTileById"),
        `Tile not found: "${id}".`
      );
    }

    return tile;
  }

  getTiles(): Set<TiledTile> {
    return new Set(this.tiles.values());
  }
}
