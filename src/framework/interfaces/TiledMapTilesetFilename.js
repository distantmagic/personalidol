// @flow

import type { Stringable } from "./Stringable";

export interface TiledMapTilesetFilename extends Stringable {
  constructor(base: string, tilesetFilename: string): void;
}
