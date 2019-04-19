// @flow

import TiledTilesetParser from "./TiledTilesetParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { QueryBus } from "../interfaces/QueryBus";
import type { TiledTileset } from "../interfaces/TiledTileset";
import type { TiledTilesetLoader as TiledTilesetLoaderInterface } from "../interfaces/TiledTilesetLoader";
import type { TiledTilesetLoaderQueryBuilder } from "../interfaces/TiledTilesetLoaderQueryBuilder";

export default class TiledTilesetLoader implements TiledTilesetLoaderInterface {
  +tiledTilesetLoaderQueryBuilder: TiledTilesetLoaderQueryBuilder;
  +queryBus: QueryBus;

  constructor(
    queryBus: QueryBus,
    tiledTilesetLoaderQueryBuilder: TiledTilesetLoaderQueryBuilder
  ) {
    this.tiledTilesetLoaderQueryBuilder = tiledTilesetLoaderQueryBuilder;
    this.queryBus = queryBus;
  }

  async load(
    cancelToken: CancelToken,
    tilesetPath: string
  ): Promise<TiledTileset> {
    const tilesetQuery = await this.tiledTilesetLoaderQueryBuilder.build(
      tilesetPath
    );
    const tilesetContent = await this.queryBus.enqueue(
      cancelToken,
      tilesetQuery
    );
    const tiledTilesetParser = new TiledTilesetParser(
      tilesetPath,
      tilesetContent
    );

    return tiledTilesetParser.parse(cancelToken);
  }
}
