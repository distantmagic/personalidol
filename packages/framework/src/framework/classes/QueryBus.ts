import autoBind from "auto-bind";
import isEmpty from "lodash/isEmpty";

import CancelTokenQuery from "src/framework/classes/CancelTokenQuery";
import EventListenerSet from "src/framework/classes/EventListenerSet";
import QueryBatch from "src/framework/classes/QueryBatch";

import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type ExceptionHandler from "src/framework/interfaces/ExceptionHandler";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type Query from "src/framework/interfaces/Query";
import type { default as ICancelTokenQuery } from "src/framework/interfaces/CancelTokenQuery";
import type { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";
import type { default as IQueryBus } from "src/framework/interfaces/QueryBus";

import type QueryBusOnEnqueuedCallback from "src/framework/types/QueryBusOnEnqueuedCallback";
import type QueryBusQueueCollection from "src/framework/types/QueryBusQueueCollection";

export default class QueryBus implements HasLoggerBreadcrumbs, IQueryBus {
  readonly enqueuedCallbacks: IEventListenerSet<[Query<any>]>;
  readonly exceptionHandler: ExceptionHandler;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  private collection: QueryBusQueueCollection<any> = [];

  constructor(exceptionHandler: ExceptionHandler, loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.enqueuedCallbacks = new EventListenerSet<[Query<any>]>(loggerBreadcrumbs.add("EventListenerSet"));
    this.exceptionHandler = exceptionHandler;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  // @cancelable(true)
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

  isFlushable(): boolean {
    return !isEmpty(this.collection);
  }

  offEnqueued<T>(callback: QueryBusOnEnqueuedCallback<T>): void {
    this.enqueuedCallbacks.delete(callback);
  }

  onEnqueued<T>(callback: QueryBusOnEnqueuedCallback<T>): void {
    this.enqueuedCallbacks.add(callback);
  }

  tick(): void {
    if (this.isFlushable()) {
      this.flush().process();
    }
  }
}
