// @flow

import CancelTokenException from "./Exception/CancelToken";
import EventListenerSet from "./EventListenerSet";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CancelTokenQuery as CancelTokenQueryInterface } from "../interfaces/CancelTokenQuery";
import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Query } from "../interfaces/Query";

export default class CancelTokenQuery<T> implements CancelTokenQueryInterface<T> {
  _isExecuted: boolean;
  _isExecuting: boolean;
  _result: ?T;
  +cancelToken: CancelToken;
  +callbacks: EventListenerSetInterface<[?T]>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +query: Query<T>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, cancelToken: CancelToken, query: Query<T>) {
    this._isExecuted = false;
    this._isExecuting = false;
    this.callbacks = new EventListenerSet<[?T]>();
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

  infer(other: CancelTokenQueryInterface<T>): T {
    const result = other.getResult();

    this.setExecuted(result);

    return result;
  }

  isCanceled(): boolean {
    return this.cancelToken.isCanceled();
  }

  isEqual(other: CancelTokenQuery<T>) {
    const thisQuery = this.getQuery();
    const otherQuery = other.getQuery();

    return thisQuery.isEqual(otherQuery);
  }

  isExecuted(): boolean {
    return this._isExecuted;
  }

  isExecuting(): boolean {
    return this._isExecuting;
  }

  onExecuted(): Promise<?T> {
    return new Promise<?T>((resolve, reject) => {
      this.cancelToken.onCanceled(reject);
      this.callbacks.add(resolve);
    });
  }

  setExecuted(result: T): void {
    if (this.isExecuted()) {
      throw new CancelTokenException(this.loggerBreadcrumbs.add("setExecuted"), "Query is already executed.");
    }

    this._isExecuted = true;
    this._isExecuting = false;
    this._result = result;

    this.callbacks.notify([result]);
    this.callbacks.clear();
  }
}
