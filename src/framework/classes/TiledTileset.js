// @flow

import { default as TiledTilesetException } from "./Exception/Tiled/Tileset";

import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledTile } from "../interfaces/TiledTile";
import type { TiledTileset as TiledTilesetInterface } from "../interfaces/TiledTileset";
import type { TiledTilesetSerializedObject } from "../types/TiledTilesetSerializedObject";

export default class TiledTileset implements TiledTilesetInterface {
  +expectedTileCount: number;
  +firstgid: number;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiles: Map<number, TiledTile>;
  +tileSize: ElementSize<"px">;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    firstgid: number,
    expectedTileCount: number,
    tileSize: ElementSize<"px">
  ): void {
    this.expectedTileCount = expectedTileCount;
    this.firstgid = firstgid;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiles = new Map<number, TiledTile>();
    this.tileSize = tileSize;
  }

  add(tile: TiledTile): void {
    this.tiles.set(tile.getId(), tile);
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledTilesetSerializedObject {
    const serializedTiles = [];

    for (let tile of this.getTiles().values()) {
      serializedTiles.push(tile.asObject());
    }

    return {
      expectedTileCount: this.getExpectedTileCount(),
      firstgid: this.getFirstgid(),
      tiles: serializedTiles,
      tileSize: this.getTileSize().asObject(),
    };
  }

  getExpectedTileCount(): number {
    return this.expectedTileCount;
  }

  getFirstgid(): number {
    return this.firstgid;
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
