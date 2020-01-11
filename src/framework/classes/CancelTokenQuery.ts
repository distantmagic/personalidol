import CancelTokenException from "./Exception/CancelToken";
import canCompare from "../helpers/canCompare";
import EventListenerSet from "./EventListenerSet";

import { CancelToken } from "../interfaces/CancelToken";
import { CancelTokenQuery as CancelTokenQueryInterface } from "../interfaces/CancelTokenQuery";
import { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import { Query } from "../interfaces/Query";

export default class CancelTokenQuery<T> implements CancelTokenQueryInterface<T> {
  private _isExecuted: boolean = false;
  private _isExecuting: boolean = false;
  private _result: null | T = null;
  readonly callbacks: EventListenerSetInterface<[T]>;
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

  infer(other: CancelTokenQueryInterface<T>): T {
    const result = other.getResult();

    this.setExecuted(result);

    return result;
  }

  isCanceled(): boolean {
    return this.cancelToken.isCanceled();
  }

  isInferableFrom(other: CancelTokenQueryInterface<any>): boolean {
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

    this._isExecuted = true;
    this._isExecuting = false;
    this._result = result;

    this.callbacks.notify([result]);
    this.callbacks.clear();
  }

  whenExecuted(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.cancelToken.onCanceled(reject);
      this.callbacks.add(resolve);
    });
  }
}
