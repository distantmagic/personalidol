// @flow

import FixturesFile from "./Query/FixturesFile";

import type { TiledMapLoaderQueryBuilder } from "../interfaces/TiledMapLoaderQueryBuilder";
import type { TiledTilesetLoaderQueryBuilder } from "../interfaces/TiledTilesetLoaderQueryBuilder";

export default class FixturesFileQueryBuilder
  implements TiledMapLoaderQueryBuilder, TiledTilesetLoaderQueryBuilder {
  async build(ref: string): Promise<FixturesFile> {
    return new FixturesFile(ref);
  }
}
