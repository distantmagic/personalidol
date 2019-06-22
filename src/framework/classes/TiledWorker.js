// @flow

import TiledMapLoader from "../classes/TiledMapLoader";
import TiledTilesetLoader from "../classes/TiledTilesetLoader";
import URLTextContentQueryBuilder from "../classes/URLTextContentQueryBuilder";
// import { default as GameboardView } from "../views/Gameboard";

// import type { TiledTilesetLoader as TiledTilesetLoaderInterface } from "../interfaces/TiledTilesetLoader";
import type { CancelToken } from "../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../interfaces/QueryBus";
import type { TiledMapLoader as TiledMapLoaderInterface } from "../interfaces/TiledMapLoader";
import type { TiledMapSerializedObject } from "../types/TiledMapSerializedObject";
import type { TiledWorker as TiledWorkerInterface } from "../interfaces/TiledWorker";
import type { TiledWorkerLoadParams } from "../types/TiledWorkerLoadParams";

export default class TiledWorker implements TiledWorkerInterface {
  +tiledMapLoader: TiledMapLoaderInterface;
  // +tiledTilesetLoader: TiledTilesetLoaderInterface;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, queryBus: QueryBus) {
    const queryBuilder = new URLTextContentQueryBuilder();
    const tiledTilesetLoader = new TiledTilesetLoader(
      loggerBreadcrumbs.add("TiledTilesetLoader"),
      queryBus,
      queryBuilder
    );

    this.tiledMapLoader = new TiledMapLoader(
      loggerBreadcrumbs.add("TiledMapLoader"),
      queryBus,
      queryBuilder,
      tiledTilesetLoader
    );
  }

  async loadMap(cancelToken: CancelToken, params: TiledWorkerLoadParams): Promise<TiledMapSerializedObject> {
    const tiledMap = await this.tiledMapLoader.load(cancelToken, params.filename);

    return tiledMap.asObject();
  }
}
