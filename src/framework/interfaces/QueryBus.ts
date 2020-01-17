import CancelToken from "src/framework/interfaces/CancelToken";
import CancelTokenQuery from "src/framework/interfaces/CancelTokenQuery";
import ClockReactive from "src/framework/interfaces/ClockReactive";
import Query from "src/framework/interfaces/Query";
import QueryBatch from "src/framework/interfaces/QueryBatch";

import QueryBusOnEnqueuedCallback from "src/framework/types/QueryBusOnEnqueuedCallback";

export default interface QueryBus extends ClockReactive {
  enqueue<T>(cancelToken: CancelToken, query: Query<T>): CancelTokenQuery<T>;

  flush(): QueryBatch;

  onEnqueued<T>(callback: QueryBusOnEnqueuedCallback<T>): void;

  offEnqueued<T>(callback: QueryBusOnEnqueuedCallback<T>): void;
}
