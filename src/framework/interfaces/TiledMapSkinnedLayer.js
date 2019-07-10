// @flow

import type { CancelToken } from "./CancelToken";
import type { TiledMapLayer } from "./TiledMapLayer";
import type { TiledSkinnedTile } from "./TiledSkinnedTile";

export interface TiledMapSkinnedLayer {
  generateSkinnedTiles(CancelToken): AsyncGenerator<TiledSkinnedTile, void, void>;

  getTiledMapLayer(): TiledMapLayer;
}
