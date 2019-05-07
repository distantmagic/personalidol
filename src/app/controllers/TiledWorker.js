// @flow

import TiledMapLoader from "../../framework/classes/TiledMapLoader";
import TiledTilesetLoader from "../../framework/classes/TiledTilesetLoader";
import URLTextContentQueryBuilder from "../../framework/classes/URLTextContentQueryBuilder";
// import { default as GameboardView } from "../views/Gameboard";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../framework/interfaces/QueryBus";

export default class TiledWorker {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, queryBus: QueryBus) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.queryBus = queryBus;
  }

  async load(cancelToken: CancelToken): Promise<{ foo: string }> {
    const queryBuilder = new URLTextContentQueryBuilder();
    const tiledTilesetLoader = new TiledTilesetLoader(
      this.loggerBreadcrumbs.add("TiledTilesetLoader"),
      this.queryBus,
      queryBuilder
    );
    const tiledMapLoader = new TiledMapLoader(
      this.loggerBreadcrumbs.add("TiledMapLoader"),
      this.queryBus,
      queryBuilder,
      tiledTilesetLoader
    );

    const tiledMap = await tiledMapLoader.load(
      cancelToken,
      "/assets/map-outlands-01.tmx"
    );

    return {
      foo: "barzzzzz"
    };
  }
}
