// @flow

import type { CancelToken } from "./CancelToken";
import type { QueryBus } from "./QueryBus";
import type { TiledMap } from "./TiledMap";
import type { TiledMapLoaderQueryBuilder } from "./TiledMapLoaderQueryBuilder";
import type { TiledTilesetLoader } from "./TiledTilesetLoader";

export interface TiledMapLoader {
  constructor(QueryBus, TiledMapLoaderQueryBuilder, TiledTilesetLoader): void;

  load(CancelToken, filename: string): Promise<TiledMap>;
}
