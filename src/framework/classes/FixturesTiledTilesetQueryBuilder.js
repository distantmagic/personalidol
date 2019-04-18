// @flow

import FixturesFile from "./Query/FixturesFile";

import type { TiledTilesetLoaderQueryBuilder } from "../interfaces/TiledTilesetLoaderQueryBuilder";

export default class FixturesTiledTilesetQueryBuilder
  implements TiledTilesetLoaderQueryBuilder {
  async build(ref: string): Promise<FixturesFile> {
    return new FixturesFile(ref);
  }
}
