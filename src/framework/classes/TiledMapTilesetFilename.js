// @flow

import path from "path";

import type { TiledMapTilesetFilename as TiledMapTilesetFilenameInterface } from "../interfaces/TiledMapTilesetFilename";

export default class TiledMapTilesetFilename
  implements TiledMapTilesetFilenameInterface {
  +base: string;
  +tilesetFilename: string;

  constructor(base: string, tilesetFilename: string): void {
    this.base = base;
    this.tilesetFilename = tilesetFilename;
  }

  asString() {
    return path.resolve(path.dirname(this.base), this.tilesetFilename);
  }
}
