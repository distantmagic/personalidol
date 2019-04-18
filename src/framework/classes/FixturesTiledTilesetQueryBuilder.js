// @flow

import FixturesTiledTileset from "./Query/FixturesTiledTileset";

import type { TiledTilesetLoaderQueryBuilder } from "../types/TiledTilesetLoaderQueryBuilder";

export default class FixturesTiledTilesetQueryBuilder
  implements TiledTilesetLoaderQueryBuilder {
  async build(ref: string): Promise<FixturesTiledTileset> {
    return new FixturesTiledTileset(ref);
  }
}
