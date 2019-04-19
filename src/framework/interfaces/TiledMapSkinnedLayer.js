// @flow

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

  generateSkinnedTiles(): AsyncGenerator<TiledSkinnedTile, void, void>;
}
