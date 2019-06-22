// @flow

import type { CancelToken } from "./CancelToken";
import type { QueryBus } from "./QueryBus";
import type { TiledTileset } from "./TiledTileset";
import type { TiledTilesetLoaderQueryBuilder } from "./TiledTilesetLoaderQueryBuilder";

export interface TiledTilesetLoader {
  // constructor(QueryBus, TiledTilesetLoaderQueryBuilder): void;
  load(CancelToken, tilesetElement: HTMLElement, filename: string): Promise<TiledTileset>;
}
