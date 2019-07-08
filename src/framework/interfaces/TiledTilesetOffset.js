// @flow

import type { TiledTileset } from "./TiledTileset";

export interface TiledTilesetOffset {
  getTilesetFirstId(): number;

  getTiledTileset(): TiledTileset;
}
