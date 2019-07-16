// @flow

import Cancelled from "./Exception/Cancelled";
import TiledSkinnedTile from "./TiledSkinnedTile";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapLayer } from "../interfaces/TiledMapLayer";
import type { TiledMapSkinnedLayer as TiledMapSkinnedLayerInterface } from "../interfaces/TiledMapSkinnedLayer";
import type { TiledSkinnedTile as TiledSkinnedTileInterface } from "../interfaces/TiledSkinnedTile";
import type { TiledTilesetOffsetCollection } from "../interfaces/TiledTilesetOffsetCollection";

export default class TiledMapSkinnedLayer implements TiledMapSkinnedLayerInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapTileSize: ElementSize<"px">;
  +tiledMapLayer: TiledMapLayer;
  +tiledTilesetOffsetCollection: TiledTilesetOffsetCollection;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    tiledMapLayer: TiledMapLayer,
    mapTileSize: ElementSize<"px">,
    tiledTilesetOffsetCollection: TiledTilesetOffsetCollection
  ): void {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.mapTileSize = mapTileSize;
    this.tiledMapLayer = tiledMapLayer;
    this.tiledTilesetOffsetCollection = tiledTilesetOffsetCollection;
  }

  async *generateSkinnedTiles(cancelToken: CancelToken): AsyncGenerator<TiledSkinnedTileInterface, void, void> {
    const tiledMapGrid = this.tiledMapLayer.getTiledMapGrid();

    for await (let positionedTile of tiledMapGrid.generatePositionedTiles()) {
      if (cancelToken.isCancelled()) {
        throw new Cancelled(
          this.loggerBreadcrumbs.add("generateSkinnedTiles"),
          "Cancel token was cancelled while generating skinned tiles."
        );
      }

      const tileTypeId = positionedTile.getId();

      if (tileTypeId > 0) {
        // otherwise it means blank
        yield new TiledSkinnedTile(
          tileTypeId,
          positionedTile,
          this.tiledTilesetOffsetCollection.getTiledTileByOffsettedId(tileTypeId),
          this.tiledTilesetOffsetCollection.getTiledTilesetByOffsettedId(tileTypeId)
        );
      }
    }
  }

  getTiledMapLayer(): TiledMapLayer {
    return this.tiledMapLayer;
  }
}
