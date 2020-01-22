import canCompare from "src/framework/helpers/canCompare";

import CancelTokenException from "src/framework/classes/Exception/CancelToken";
import EventListenerSet from "src/framework/classes/EventListenerSet";

import Canceled from "src/framework/interfaces/Exception/Canceled";
import CancelToken from "src/framework/interfaces/CancelToken";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import Query from "src/framework/interfaces/Query";
import { default as ICancelTokenQuery } from "src/framework/interfaces/CancelTokenQuery";
import { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";

export default class CancelTokenQuery<T> implements ICancelTokenQuery<T>, HasLoggerBreadcrumbs {
  private _isExecuted: boolean = false;
  private _isExecuting: boolean = false;
  private _result: null | T = null;
  readonly callbacks: IEventListenerSet<[T]>;
  readonly cancelToken: CancelToken;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly query: Query<T>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, cancelToken: CancelToken, query: Query<T>) {
    this.callbacks = new EventListenerSet<[T]>(loggerBreadcrumbs);
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.cancelToken = cancelToken;
    this.query = query;
  }

  execute(): Promise<T> {
    if (this.isExecuting() || this.isExecuted()) {
      throw new CancelTokenException(this.loggerBreadcrumbs.add("execute"), "You cannot execute query more than once.");
    }

    this._isExecuting = true;

    return this.query.execute(this.cancelToken).then(result => {
      this.setExecuted(result);

      return result;
    });
  }

  getQuery(): Query<T> {
    return this.query;
  }

  getResult(): T {
    if (this.isExecuting()) {
      throw new CancelTokenException(this.loggerBreadcrumbs.add("getResult"), "Query is still executing.");
    }
    if (!this.isExecuted()) {
      throw new CancelTokenException(this.loggerBreadcrumbs.add("getResult"), "Query must be executed before asking for a result.");
    }
    if (!this._result) {
      throw new CancelTokenException(this.loggerBreadcrumbs.add("getResult"), "Execution result is not set and it was expected.");
    }

    return this._result;
  }

  infer(other: ICancelTokenQuery<T>): T {
    const result = other.getResult();

    this.setExecuted(result);

    return result;
  }

  isCanceled(): boolean {
    return this.cancelToken.isCanceled();
  }

  isInferableFrom(other: ICancelTokenQuery<any>): boolean {
    if (this === other) {
      return false;
    }

    const aQuery = this.getQuery();
    const bQuery = other.getQuery();

    if (aQuery === bQuery || !canCompare(aQuery, bQuery)) {
      return false;
    }

    return aQuery.isEqual(bQuery);
  }

  isExecuted(): boolean {
    return this._isExecuted;
  }

  isExecuting(): boolean {
    return this._isExecuting;
  }

  setExecuted(result: T): void {
    if (this.isExecuted()) {
      throw new CancelTokenException(this.loggerBreadcrumbs.add("setExecuted"), "Query is already executed.");
    }

    if (this.cancelToken.isCanceled()) {
      throw new CancelTokenException(this.loggerBreadcrumbs.add("setExecuted"), "Query is canceled and it can't be set as executed.");
    }

    this._isExecuted = true;
    this._isExecuting = false;
    this._result = result;

    this.callbacks.notify([result]);
    this.callbacks.clear();
  }

  whenExecuted(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.callbacks.add(resolve);
      this.cancelToken.onCanceled((canceled: Canceled) => {
        // can be executed before query got canceled
        if (this.callbacks.has(resolve)) {
          this.callbacks.delete(resolve);
        }

        reject(canceled);
      });
    });
  }
}
