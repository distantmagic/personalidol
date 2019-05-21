// @flow

import URLTextContent from "./Query/URLTextContent";

import type { TiledMapLoaderQueryBuilder } from "../interfaces/TiledMapLoaderQueryBuilder";
import type { TiledTilesetLoaderQueryBuilder } from "../interfaces/TiledTilesetLoaderQueryBuilder";

export default class URLTextContentQueryBuilder implements TiledMapLoaderQueryBuilder, TiledTilesetLoaderQueryBuilder {
  async build(ref: string): Promise<URLTextContent> {
    return new URLTextContent(ref);
  }
}
