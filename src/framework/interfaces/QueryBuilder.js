// @flow

import type { Query } from "./Query";

export interface QueryBuilder<T: string, U: Query<any>> {
  build(ref: T): Promise<U>;
}
