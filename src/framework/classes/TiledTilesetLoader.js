// @flow

import TiledTilesetParser from "./TiledTilesetParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { QueryBus } from "../interfaces/QueryBus";
import type { TiledTileset } from "../interfaces/TiledTileset";
import type { TiledTilesetLoader as TiledTilesetLoaderInterface } from "../interfaces/TiledTilesetLoader";
import type { TiledTilesetParser as TiledTilesetParserInterface } from "../interfaces/TiledTilesetParser";
import type { TiledTilesetLoaderQueryBuilder } from "../types/TiledTilesetLoaderQueryBuilder";

export default class TiledTilesetLoader implements TiledTilesetLoaderInterface {
  +queryBuilder: TiledTilesetLoaderQueryBuilder;
  +queryBus: QueryBus;

  constructor(
    queryBus: QueryBus,
    queryBuilder: TiledTilesetLoaderQueryBuilder
  ) {
    this.queryBuilder = queryBuilder;
    this.queryBus = queryBus;
  }

  async load(
    cancelToken: CancelToken,
    tilesetPath: string
  ): Promise<TiledTileset> {
    const tilesetQuery = await this.queryBuilder.build(tilesetPath);

    return await this.queryBus.enqueue(cancelToken, tilesetQuery);
  }
}
