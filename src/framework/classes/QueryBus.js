// @flow

import CancelTokenQuery from "./CancelTokenQuery";
import EventListenerSet from "./EventListenerSet";
import QueryBatch from "./QueryBatch";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ClockTick } from "../interfaces/ClockTick";
import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Query } from "../interfaces/Query";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";
import type { QueryBusOnEnqueuedCallback } from "../types/QueryBusOnEnqueuedCallback";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export default class QueryBus implements QueryBusInterface {
  +enqueuedCallbacks: EventListenerSetInterface<[Query<any>]>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  collection: QueryBusQueueCollection<any>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.collection = [];
    this.enqueuedCallbacks = new EventListenerSet<[Query<any>]>();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  enqueue<T>(cancelToken: CancelToken, query: Query<T>): Promise<?T> {
    const cancelTokenQuery = new CancelTokenQuery(this.loggerBreadcrumbs.add("enqueue"), cancelToken, query);

    this.collection.push(cancelTokenQuery);
    this.enqueuedCallbacks.notify([query]);

    return cancelTokenQuery.onExecuted();
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

  tick(tick: ClockTick): Promise<void> {
    // Random things happen, timeouts and intervals are not reliable (those are
    // definitely not real time clocks) and QueryBus is really important to
    // the system.
    // It's better to have this additional check here, just for safety.
    if (tick.isCanceled()) {
      return Promise.resolve(void 0);
    }

    return this.flush().process();
  }
}
