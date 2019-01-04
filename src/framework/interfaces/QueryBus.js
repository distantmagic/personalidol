// @flow

import type { CancelToken } from "./CancelToken";
import type { Query } from "./Query";

export interface QueryBus {
  enqueue<T>(cancelToken: CancelToken, query: Query<T>): Promise<T>;

  process(): Promise<void>;
}
