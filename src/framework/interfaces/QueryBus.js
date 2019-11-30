// @flow

import type { CancelToken } from "./CancelToken";
import type { ClockReactive } from "./ClockReactive";
import type { Query } from "./Query";
import type { QueryBatch } from "./QueryBatch";
import type { QueryBusOnEnqueuedCallback } from "../types/QueryBusOnEnqueuedCallback";

export interface QueryBus extends ClockReactive {
  enqueue<T>(cancelToken: CancelToken, query: Query<T>): Promise<T>;

  flush(): QueryBatch;

  onEnqueued(QueryBusOnEnqueuedCallback): void;

  offEnqueued(QueryBusOnEnqueuedCallback): void;
}
