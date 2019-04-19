// @flow

import Cancelled from "./Exception/Cancelled";
import TiledSkinnedTile from "./TiledSkinnedTile";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapLayer } from "../interfaces/TiledMapLayer";
import type { TiledMapSkinnedLayer as TiledMapSkinnedLayerInterface } from "../interfaces/TiledMapSkinnedLayer";
import type { TiledSkinnedTile as TiledSkinnedTileInterface } from "../interfaces/TiledSkinnedTile";
import type { TiledTileset } from "../interfaces/TiledTileset";

export default class TiledMapSkinnedLayer
  implements TiledMapSkinnedLayerInterface {
  +mapTileSize: ElementSize<"px">;
  +tiledMapLayer: TiledMapLayer;
  +tiledTileset: TiledTileset;

  constructor(
    tiledMapLayer: TiledMapLayer,
    mapTileSize: ElementSize<"px">,
    tiledTileset: TiledTileset
  ): void {
    this.mapTileSize = mapTileSize;
    this.tiledMapLayer = tiledMapLayer;
    this.tiledTileset = tiledTileset;
  }

  async *generateSkinnedTiles(
    cancelToken: CancelToken
  ): AsyncGenerator<TiledSkinnedTileInterface, void, void> {
    const tiledMapGrid = this.tiledMapLayer.getTiledMapGrid();

    for await (let positionedTile of tiledMapGrid.generatePositionedTiles()) {
      if (cancelToken.isCancelled()) {
        throw new Cancelled(
          "Cancel token was cancelled while generating skinned tiles."
        );
      }

      const tileTypeId = positionedTile.getId();

      if (tileTypeId < 0) {
        // this one means blank
        continue;
      }

      yield new TiledSkinnedTile(
        tileTypeId,
        positionedTile,
        this.tiledTileset.getTileById(tileTypeId)
      );
    }
  }
}
