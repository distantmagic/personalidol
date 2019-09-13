// @flow

import { default as TiledTilesetException } from "./Exception/Tiled/Tileset";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledTile } from "../interfaces/TiledTile";
import type { TiledTileset } from "../interfaces/TiledTileset";
import type { TiledTilesetOffset } from "../interfaces/TiledTilesetOffset";
import type { TiledTilesetOffsetCollection as TiledTilesetOffsetCollectionInterface } from "../interfaces/TiledTilesetOffsetCollection";

export default class TiledTilesetOffsetCollection implements TiledTilesetOffsetCollectionInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiledTilesetOffsets: Array<TiledTilesetOffset>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiledTilesetOffsets = [];
  }

  addTiledTilesetOffset(tiledTilesetOffset: TiledTilesetOffset): void {
    this.tiledTilesetOffsets.push(tiledTilesetOffset);
  }

  getTiledTileByOffsettedId(tiledTileOffsettedId: number): TiledTile {
    return this.getTiledTilesetOffsetByOffsettedId(tiledTileOffsettedId).getTiledTileByOffsettedId(
      tiledTileOffsettedId
    );
  }

  getTiledTilesetByOffsettedId(tiledTileOffsettedId: number): TiledTileset {
    return this.getTiledTilesetOffsetByOffsettedId(tiledTileOffsettedId).getTiledTileset();
  }

  getTiledTilesetOffsetByOffsettedId(tiledTileOffsettedId: number): TiledTilesetOffset {
    let tiledTilesetOffset;

    for (tiledTilesetOffset of this.tiledTilesetOffsets) {
      if (tiledTilesetOffset.hasTiledTileOffsetedId(tiledTileOffsettedId)) {
        return tiledTilesetOffset;
      }
    }

    throw new TiledTilesetException(
      this.loggerBreadcrumbs.add("getTiledTileByOffsettedId"),
      `Tileset with offset does not exist: "${tiledTileOffsettedId}"`
    );
  }

  getTiledTilesetOffsets(): Set<TiledTilesetOffset> {
    return new Set(this.tiledTilesetOffsets);
  }

  hasTiledTilesetOffset(tiledTilesetOffset: TiledTilesetOffset): boolean {
    let thisTiledTilesetOffset;

    for (thisTiledTilesetOffset of this.getTiledTilesetOffsets().values()) {
      if (tiledTilesetOffset.isEqual(thisTiledTilesetOffset)) {
        return true;
      }
    }

    return false;
  }

  isEqual(other: TiledTilesetOffsetCollectionInterface): boolean {
    const thisTiledTilesetOffsets = this.getTiledTilesetOffsets();
    const otherTiledTilesetOffsets = other.getTiledTilesetOffsets();

    if (thisTiledTilesetOffsets.size !== otherTiledTilesetOffsets.size) {
      return false;
    }

    let thisTiledTilesetOffset;

    for (thisTiledTilesetOffset of thisTiledTilesetOffsets.values()) {
      if (!other.hasTiledTilesetOffset(thisTiledTilesetOffset)) {
        return false;
      }
    }

    return true;
  }
}
