// @flow

import FixturesFile from "./Query/FixturesFile";

import type { TiledMapLoaderQueryBuilder } from "../interfaces/TiledMapLoaderQueryBuilder";

export default class FixturesTiledMapQueryBuilder
  implements TiledMapLoaderQueryBuilder {
  async build(ref: string): Promise<FixturesFile> {
    return new FixturesFile(ref);
  }
}
