import { CancelToken } from "./CancelToken";
import { CancelTokenQuery } from "./CancelTokenQuery";
import { ClockReactive } from "./ClockReactive";
import { Query } from "./Query";
import { QueryBatch } from "./QueryBatch";
import { QueryBusOnEnqueuedCallback } from "../types/QueryBusOnEnqueuedCallback";

export interface QueryBus extends ClockReactive {
  enqueue<T>(cancelToken: CancelToken, query: Query<T>): CancelTokenQuery<T>;

  flush(): QueryBatch;

  onEnqueued<T>(callback: QueryBusOnEnqueuedCallback<T>): void;

  offEnqueued<T>(callback: QueryBusOnEnqueuedCallback<T>): void;
}
