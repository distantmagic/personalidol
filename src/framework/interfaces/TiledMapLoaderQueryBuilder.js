// @flow

import type { Query } from "./Query";
import type { QueryBuilder } from "./QueryBuilder";

export interface TiledMapLoaderQueryBuilder
  extends QueryBuilder<string, Query<string>> {}
