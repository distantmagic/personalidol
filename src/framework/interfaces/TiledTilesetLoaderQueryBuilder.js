// @flow

import type { Query } from "./Query";
import type { QueryBuilder } from "./QueryBuilder";

export interface TiledTilesetLoaderQueryBuilder extends QueryBuilder<string, Query<string>> {}
