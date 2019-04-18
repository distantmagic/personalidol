// @flow

import type { Query } from "../interfaces/Query";
import type { QueryBuilder } from "../interfaces/QueryBuilder";
import type { TiledTileset } from "../interfaces/TiledTileset";

export type TiledTilesetLoaderQueryBuilder = QueryBuilder<
  string,
  Query<TiledTileset>
>;
