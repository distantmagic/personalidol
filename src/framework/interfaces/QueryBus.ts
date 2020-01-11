// @flow strict

import type { CancelToken } from "./CancelToken";
import type { CancelTokenQuery } from "./CancelTokenQuery";
import type { ClockReactive } from "./ClockReactive";
import type { Query } from "./Query";
import type { QueryBatch } from "./QueryBatch";
import type { QueryBusOnEnqueuedCallback } from "../types/QueryBusOnEnqueuedCallback";

export interface QueryBus extends ClockReactive {
  enqueue<T>(cancelToken: CancelToken, query: Query<T>): CancelTokenQuery<T>;

  flush(): QueryBatch;

  onEnqueued(QueryBusOnEnqueuedCallback): void;

  offEnqueued(QueryBusOnEnqueuedCallback): void;
}
