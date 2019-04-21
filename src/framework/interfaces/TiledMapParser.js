// @flow

import type { AsyncParser } from "./AsyncParser";
import type { TiledMap } from "./TiledMap";
import type { TiledTilesetLoader } from "./TiledTilesetLoader";

export interface TiledMapParser extends AsyncParser<TiledMap> {
  // constructor(
  //   filename: string,
  //   content: string,
  //   tiledTilesetLoader: TiledTilesetLoader
  // ): void;
}
