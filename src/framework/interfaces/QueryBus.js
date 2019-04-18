// @flow

import type { CancelToken } from "./CancelToken";
import type { ClockTick } from "./ClockTick";
import type { Query } from "./Query";
import type { QueryBatch } from "./QueryBatch";
import type { QueryBusOnEnqueuedCallback } from "../types/QueryBusOnEnqueuedCallback";

export interface QueryBus {
  enqueue<T>(cancelToken: CancelToken, query: Query<T>): Promise<T>;

  findSimilarQuery<T>(Query<T>): ?Query<T>;

  flush(): QueryBatch;

  onEnqueued(QueryBusOnEnqueuedCallback): void;

  offEnqueued(QueryBusOnEnqueuedCallback): void;

  tick(ClockTick): Promise<QueryBus>;
}
