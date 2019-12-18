// @flow

import CancelTokenQuery from "./CancelTokenQuery";
import EventListenerSet from "./EventListenerSet";
import QueryBatch from "./QueryBatch";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CancelTokenQuery as CancelTokenQueryInterface } from "../interfaces/CancelTokenQuery";
import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Query } from "../interfaces/Query";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";
import type { QueryBusOnEnqueuedCallback } from "../types/QueryBusOnEnqueuedCallback";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export default class QueryBus implements QueryBusInterface {
  +enqueuedCallbacks: EventListenerSetInterface<[Query<any>]>;
  +exceptionHandler: ExceptionHandler;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  collection: QueryBusQueueCollection<any>;

  constructor(exceptionHandler: ExceptionHandler, loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.collection = [];
    this.enqueuedCallbacks = new EventListenerSet<[Query<any>]>();
    this.exceptionHandler = exceptionHandler;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  enqueue<T>(cancelToken: CancelToken, query: Query<T>): CancelTokenQueryInterface<T> {
    const cancelTokenQuery = new CancelTokenQuery(this.loggerBreadcrumbs.add("enqueue"), cancelToken, query);

    this.collection.push(cancelTokenQuery);
    this.enqueuedCallbacks.notify([query]);

    return cancelTokenQuery;
  }

  flush(): QueryBatch {
    const queryBatch = new QueryBatch(this.exceptionHandler, this.collection);

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

  tick(): void {
    this.flush().process();
  }
}
