// @flow

import Canceled from "./Exception/Canceled";
import TiledTilesetParser from "./TiledTilesetParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../interfaces/QueryBus";
import type { TiledTileset } from "../interfaces/TiledTileset";
import type { TiledTilesetLoader as TiledTilesetLoaderInterface } from "../interfaces/TiledTilesetLoader";
import type { TiledTilesetLoaderQueryBuilder } from "../interfaces/TiledTilesetLoaderQueryBuilder";

export default class TiledTilesetLoader implements TiledTilesetLoaderInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiledTilesetLoaderQueryBuilder: TiledTilesetLoaderQueryBuilder;
  +queryBus: QueryBus;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    tiledTilesetLoaderQueryBuilder: TiledTilesetLoaderQueryBuilder
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiledTilesetLoaderQueryBuilder = tiledTilesetLoaderQueryBuilder;
    this.queryBus = queryBus;
  }

  async load(cancelToken: CancelToken, tilesetElement: HTMLElement, tilesetPath: string): Promise<TiledTileset> {
    if (cancelToken.isCanceled()) {
      throw new Canceled(
        this.loggerBreadcrumbs.add("load"),
        "Token was already canceled before loading Tiled tileset."
      );
    }

    const tilesetQuery = await this.tiledTilesetLoaderQueryBuilder.build(tilesetPath);
    const tilesetContent = await this.queryBus.enqueue(cancelToken, tilesetQuery);
    const tiledTilesetParser = new TiledTilesetParser(
      this.loggerBreadcrumbs.add("TiledTilesetParser"),
      tilesetElement,
      tilesetPath,
      tilesetContent
    );

    return tiledTilesetParser.parse(cancelToken);
  }
}
