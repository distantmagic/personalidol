// @flow

import type { Parser } from "./Parser";
import type { TiledMap } from "./TiledMap";
import type { TiledTilesetLoader } from "./TiledTilesetLoader";

export interface TiledMapParser extends Parser<TiledMap> {
  constructor(
    filename: string,
    content: string,
    tiledTilesetLoader: TiledTilesetLoader
  ): void;
}
