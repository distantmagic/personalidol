// @flow

import { default as CancelTokenException } from "./Exception/CancelToken";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CancelTokenQuery as CancelTokenQueryInterface } from "../interfaces/CancelTokenQuery";
import type { Query } from "../interfaces/Query";

type CancelTokenQueryCallback<U> = (?U) => any;

export default class CancelTokenQuery<T>
  implements CancelTokenQueryInterface<T> {
  _isExecuted: boolean;
  _isExecuting: boolean;
  _result: ?T;
  +cancelToken: CancelToken;
  +callbacks: Set<CancelTokenQueryCallback<T>>;
  +query: Query<T>;

  constructor(cancelToken: CancelToken, query: Query<T>) {
    this._isExecuted = false;
    this._isExecuting = false;
    this.callbacks = new Set();
    this.cancelToken = cancelToken;
    this.query = query;
  }

  execute(): Promise<?T> {
    if (this.isExecuting() || this.isExecuted()) {
      throw new CancelTokenException(
        "You cannot execute query more than once."
      );
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
      throw new CancelTokenException("Query is still executing.");
    }
    if (!this.isExecuted()) {
      throw new CancelTokenException(
        "Query must be executed before asking for a result."
      );
    }
    if (!this._result) {
      throw new CancelTokenException(
        "Execution result is not set and it was expected."
      );
    }

    return this._result;
  }

  isCancelled(): boolean {
    return this.cancelToken.isCancelled();
  }

  isEqual(other: CancelTokenQuery<T>) {
    return this.query.isEqual(other.query);
  }

  isExecuted(): boolean {
    return this._isExecuted;
  }

  isExecuting(): boolean {
    return this._isExecuting;
  }

  onExecuted(): Promise<?T> {
    return new Promise<?T>((resolve, reject) => {
      this.cancelToken.onCancelled(reject);
      this.callbacks.add(resolve);
    });
  }

  setExecuted(result: ?T): void {
    if (this.isExecuted()) {
      throw new CancelTokenException("Query is already executed.");
    }

    this._isExecuted = true;
    this._isExecuting = false;
    this._result = result;

    for (let callback of this.callbacks.values()) {
      callback(result);
    }
    this.callbacks.clear();
  }
}
