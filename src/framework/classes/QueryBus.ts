import autoBind from "auto-bind";

import CancelTokenQuery from "./CancelTokenQuery";
import EventListenerSet from "./EventListenerSet";
import QueryBatch from "./QueryBatch";

import { CancelToken } from "../interfaces/CancelToken";
import { CancelTokenQuery as CancelTokenQueryInterface } from "../interfaces/CancelTokenQuery";
import { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import { ExceptionHandler } from "../interfaces/ExceptionHandler";
import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import { Query } from "../interfaces/Query";
import { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";
import { QueryBusOnEnqueuedCallback } from "../types/QueryBusOnEnqueuedCallback";
import { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export default class QueryBus implements QueryBusInterface {
  readonly enqueuedCallbacks: EventListenerSetInterface<[Query<any>]>;
  readonly exceptionHandler: ExceptionHandler;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  collection: QueryBusQueueCollection<any>;

  constructor(exceptionHandler: ExceptionHandler, loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.collection = [];
    this.enqueuedCallbacks = new EventListenerSet<[Query<any>]>(loggerBreadcrumbs.add("EventListenerSet"));
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

  offEnqueued<T>(callback: QueryBusOnEnqueuedCallback<T>): void {
    this.enqueuedCallbacks.delete(callback);
  }

  onEnqueued<T>(callback: QueryBusOnEnqueuedCallback<T>): void {
    this.enqueuedCallbacks.add(callback);
  }

  tick(): void {
    this.flush().process();
  }
}
