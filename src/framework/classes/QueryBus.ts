import autoBind from "auto-bind";

import CancelTokenQuery from "src/framework/classes/CancelTokenQuery";
import EventListenerSet from "src/framework/classes/EventListenerSet";
import QueryBatch from "src/framework/classes/QueryBatch";

import CancelToken from "src/framework/interfaces/CancelToken";
import ExceptionHandler from "src/framework/interfaces/ExceptionHandler";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import Query from "src/framework/interfaces/Query";
import { default as ICancelTokenQuery } from "src/framework/interfaces/CancelTokenQuery";
import { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";
import { default as IQueryBus } from "src/framework/interfaces/QueryBus";

import QueryBusOnEnqueuedCallback from "src/framework/types/QueryBusOnEnqueuedCallback";
import QueryBusQueueCollection from "src/framework/types/QueryBusQueueCollection";

export default class QueryBus implements IQueryBus {
  readonly enqueuedCallbacks: IEventListenerSet<[Query<any>]>;
  readonly exceptionHandler: ExceptionHandler;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  private collection: QueryBusQueueCollection<any>;

  constructor(exceptionHandler: ExceptionHandler, loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.collection = [];
    this.enqueuedCallbacks = new EventListenerSet<[Query<any>]>(loggerBreadcrumbs.add("EventListenerSet"));
    this.exceptionHandler = exceptionHandler;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  enqueue<T>(cancelToken: CancelToken, query: Query<T>): ICancelTokenQuery<T> {
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
