// @flow

import type { Query } from "../interfaces/Query";
import type { QueryBuilder } from "../interfaces/QueryBuilder";

export type TiledTilesetLoaderQueryBuilder = QueryBuilder<
  string,
  Query<string>
>;
