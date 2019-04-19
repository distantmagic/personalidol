// @flow

import type { CancelToken } from "./CancelToken";
import type { ElementSize } from "./ElementSize";
import type { TiledMapLayer } from "./TiledMapLayer";
import type { TiledSkinnedTile } from "./TiledSkinnedTile";
import type { TiledTileset } from "./TiledTileset";

export interface TiledMapSkinnedLayer {
  constructor(
    TiledMapLayer,
    mapTileSize: ElementSize<"px">,
    TiledTileset
  ): void;

  generateSkinnedTiles(
    CancelToken
  ): AsyncGenerator<TiledSkinnedTile, void, void>;
}
