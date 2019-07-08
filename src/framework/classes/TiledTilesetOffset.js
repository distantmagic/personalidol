// @flow

import type { TiledTileset } from "../interfaces/TiledTileset";
import type { TiledTilesetOffset as TiledTilesetOffsetInterface } from "../interfaces/TiledTilesetOffset";

export default class TiledTilesetOffset implements TiledTilesetOffsetInterface {
  +firstgid: number;
  +tiledTileset: TiledTileset;

  constructor(firstgid: number, tiledTileset: TiledTileset) {
    this.firstgid = firstgid;
    this.tiledTileset = tiledTileset;
  }

  getTilesetFirstId(): number {
    return this.firstgid;
  }

  getTiledTileset(): TiledTileset {
    return this.tiledTileset;
  }
}
