// @flow

import CancelTokenQuery from "./CancelTokenQuery";
import QueryBatch from "./QueryBatch";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ClockTick } from "../interfaces/ClockTick";
import type { Query } from "../interfaces/Query";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";
import type { QueryBusOnEnqueuedCallback } from "../types/QueryBusOnEnqueuedCallback";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export default class QueryBus implements QueryBusInterface {
  +enqueuedCallbacks: Set<QueryBusOnEnqueuedCallback>;
  collection: QueryBusQueueCollection;

  constructor() {
    this.collection = [];
    this.enqueuedCallbacks = new Set<QueryBusOnEnqueuedCallback>();
  }

  enqueue<T>(cancelToken: CancelToken, query: Query<T>): Promise<?T> {
    const pickedQuery = this.findSimilarQuery(query) || query;
    const cancelTokenQuery = new CancelTokenQuery(cancelToken, pickedQuery);

    this.collection.push(cancelTokenQuery);

    for (let callback of this.enqueuedCallbacks.values()) {
      callback(pickedQuery);
    }

    return cancelTokenQuery.onExecuted();
  }

  findSimilarQuery<T>(other: Query<T>): ?Query<T> {
    const found = this.collection.find(cancelTokenQuery =>
      cancelTokenQuery.getQuery().isEqual(other)
    );

    return found ? found.getQuery() : null;
  }

  flush(): QueryBatch {
    const queryBatch = new QueryBatch(this.collection);

    // clear collection
    this.collection = [];

    return queryBatch;
  }

  offEnqueued(callback: QueryBusOnEnqueuedCallback): void {
    this.enqueuedCallbacks.delete(callback);
  }

  onEnqueued(callback: QueryBusOnEnqueuedCallback): void {
    this.enqueuedCallbacks.add(callback);
  }

  async tick(tick: ClockTick): Promise<QueryBusInterface> {
    // Random things happen, timeouts and intervals are not reliable (those are
    // definitely not real time clocks) and QueryBus is really important to
    // the system.
    // It's better to have this additional check here, just for safety.
    if (tick.isCancelled()) {
      return this;
    }

    await this.flush().process();

    return this;
  }
}
