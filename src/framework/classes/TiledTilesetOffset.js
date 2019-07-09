// @flow

import type { TiledTile } from "../interfaces/TiledTile";
import type { TiledTileset } from "../interfaces/TiledTileset";
import type { TiledTilesetOffset as TiledTilesetOffsetInterface } from "../interfaces/TiledTilesetOffset";

export default class TiledTilesetOffset implements TiledTilesetOffsetInterface {
  +firstgid: number;
  +tiledTileset: TiledTileset;

  constructor(firstgid: number, tiledTileset: TiledTileset) {
    this.firstgid = firstgid;
    this.tiledTileset = tiledTileset;
  }

  getActualTiledTileId(tiledTileOffsettedId: number): number {
    return tiledTileOffsettedId - this.firstgid;
  }

  getTilesetFirstId(): number {
    return this.firstgid;
  }

  getTiledTileByOffsettedId(tiledTileOffsettedId: number): TiledTile {
    const actualTiledTileId = this.getActualTiledTileId(tiledTileOffsettedId);

    return this.tiledTileset.getTileById(actualTiledTileId);
  }

  getTiledTileset(): TiledTileset {
    return this.tiledTileset;
  }

  hasTiledTileOffsetedId(tiledTileOffsettedId: number): boolean {
    const actualTiledTileId = this.getActualTiledTileId(tiledTileOffsettedId);

    return this.tiledTileset.hasTileWithId(actualTiledTileId);
  }

  isEqual(other: TiledTilesetOffsetInterface): boolean {
    if (this.getTilesetFirstId() !== other.getTilesetFirstId()) {
      return false;
    }

    return this.getTiledTileset().isEqual(other.getTiledTileset());
  }
}
