// @flow

import type { CancelToken } from "./CancelToken";
import type { ClockTick } from "./ClockTick";
import type { Query } from "./Query";
import type { QueryBatch } from "./QueryBatch";

export interface QueryBus {
  enqueue<T>(cancelToken: CancelToken, query: Query<T>): Promise<T>;

  findSimilarQuery<T>(Query<T>): ?Query<T>;

  flush(): QueryBatch;

  pickQuery<T>(Query<T>): Query<T>;

  tick(ClockTick): Promise<QueryBus>;
}
