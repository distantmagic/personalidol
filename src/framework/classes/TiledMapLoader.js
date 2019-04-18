// @flow

import TiledMapParser from "./TiledMapParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { QueryBus } from "../interfaces/QueryBus";
import type { TiledMap } from "../interfaces/TiledMap";
import type { TiledMapLoader as TiledMapLoaderInterface } from "../interfaces/TiledMapLoader";
import type { TiledMapLoaderQueryBuilder } from "../interfaces/TiledMapLoaderQueryBuilder";
import type { TiledTilesetLoader } from "../interfaces/TiledTilesetLoader";

export default class TiledMapLoader implements TiledMapLoaderInterface {
  +queryBus: QueryBus;
  +tiledMapLoaderQueryBuilder: TiledMapLoaderQueryBuilder;
  +tiledTilesetLoader: TiledTilesetLoader;

  constructor(
    queryBus: QueryBus,
    tiledMapLoaderQueryBuilder: TiledMapLoaderQueryBuilder,
    tiledTilesetLoader: TiledTilesetLoader
  ): void {
    this.queryBus = queryBus;
    this.tiledMapLoaderQueryBuilder = tiledMapLoaderQueryBuilder;
    this.tiledTilesetLoader = tiledTilesetLoader;
  }

  async load(cancelToken: CancelToken, mapPath: string): Promise<TiledMap> {
    const mapQuery = await this.tiledMapLoaderQueryBuilder.build(mapPath);
    const mapContent = await this.queryBus.enqueue(cancelToken, mapQuery);
    const tiledMapParser = new TiledMapParser(
      mapPath,
      mapContent,
      this.tiledTilesetLoader
    );

    return tiledMapParser.parse(cancelToken);
  }
}
