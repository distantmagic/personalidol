import type CancelToken from "src/framework/interfaces/CancelToken";
import type CancelTokenQuery from "src/framework/interfaces/CancelTokenQuery";
import type ClockReactive from "src/framework/interfaces/ClockReactive";
import type Query from "src/framework/interfaces/Query";
import type QueryBatch from "src/framework/interfaces/QueryBatch";

import type QueryBusOnEnqueuedCallback from "src/framework/types/QueryBusOnEnqueuedCallback";

export default interface QueryBus extends ClockReactive {
  enqueue<T>(cancelToken: CancelToken, query: Query<T>): CancelTokenQuery<T>;

  flush(): QueryBatch;

  isFlushable(): boolean;

  onEnqueued<T>(callback: QueryBusOnEnqueuedCallback<T>): void;

  offEnqueued<T>(callback: QueryBusOnEnqueuedCallback<T>): void;
}
