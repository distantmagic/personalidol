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

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, expectedTileCount: number, tileSize: ElementSize<"px">): void {
    this.expectedTileCount = expectedTileCount;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiles = new Map<number, TiledTile>();
    this.tileSize = tileSize;
  }

  add(tile: TiledTile): void {
    this.tiles.set(tile.getId(), tile);
  }

  getExpectedTileCount(): number {
    return this.expectedTileCount;
  }

  getTileById(id: number): TiledTile {
    const tile = this.tiles.get(id);

    if (!tile) {
      throw new TiledTilesetException(this.loggerBreadcrumbs.add("getTileById"), `Tile not found: "${id}".`);
    }

    return tile;
  }

  getTileSize(): ElementSize<"px"> {
    return this.tileSize;
  }

  getTiles(): Set<TiledTile> {
    return new Set(this.tiles.values());
  }

  hasTileWithId(id: number): boolean {
    return this.tiles.has(id);
  }

  isEqual(other: TiledTilesetInterface): boolean {
    if (this.getExpectedTileCount() !== other.getExpectedTileCount()) {
      return false;
    }

    if (!this.getTileSize().isEqual(other.getTileSize())) {
      return false;
    }

    const tiles = this.getTiles();
    const otherTiles = other.getTiles();

    if (tiles.size !== otherTiles.size) {
      return false;
    }

    for (let tile of tiles.values()) {
      if (!tile.isEqual(other.getTileById(tile.getId()))) {
        return false;
      }
    }

    return true;
  }
}
