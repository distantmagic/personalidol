// @flow

import type { CancelToken } from "../interfaces/CancelToken";
import type { CancelTokenQuery as CancelTokenQueryInterface } from "../interfaces/CancelTokenQuery";
import type { Query } from "../interfaces/Query";

type CancelTokenQueryCallback<U> = (?U) => any;

export default class CancelTokenQuery<T>
  implements CancelTokenQueryInterface<T> {
  _executionResult: ?T;
  _isExecuted: boolean;
  _result: ?T;
  +cancelToken: CancelToken;
  +callbacks: Set<CancelTokenQueryCallback<T>>;
  +query: Query<T>;

  constructor(cancelToken: CancelToken, query: Query<T>) {
    this.callbacks = new Set();
    this.cancelToken = cancelToken;
    this._isExecuted = false;
    this.query = query;
  }

  execute(): Promise<?T> {
    return this.query.execute(this.cancelToken).then(result => {
      this.setExecuted(result);

      return result;
    });
  }

  getQuery(): Query<T> {
    return this.query;
  }

  getResult(): T {
    if (!this._result) {
      throw new Error("Execution result is not set and it was expected.");
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

  onExecuted(): Promise<?T> {
    return new Promise<?T>((resolve, reject) => {
      this.cancelToken.onCancelled(reject);
      this.callbacks.add(resolve);
    });
  }

  setExecuted(result: ?T): void {
    this._executionResult = result;
    this._isExecuted = true;
    this._result = result;

    for (let [callback] of this.callbacks.entries()) {
      callback(result);
    }
    this.callbacks.clear();
  }
}
