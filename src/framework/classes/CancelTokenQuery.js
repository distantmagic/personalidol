// @flow

import EventEmitter from "eventemitter3";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CancelTokenQuery as CancelTokenQueryInterface } from "../interfaces/CancelTokenQuery";
import type { Query } from "../interfaces/Query";

export default class CancelTokenQuery<T>
  implements CancelTokenQueryInterface<T> {
  _executionResult: T;
  _isExecuted: boolean;
  _result: ?T;
  +cancelToken: CancelToken;
  +eventEmitter: EventEmitter;
  +query: Query<T>;

  constructor(cancelToken: CancelToken, query: Query<T>) {
    this.cancelToken = cancelToken;
    this.eventEmitter = new EventEmitter();
    this._isExecuted = false;
    this.query = query;
  }

  execute(): Promise<T> {
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

  onExecuted(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.cancelToken.onCancelled().then(reject);
      this.eventEmitter.once("executed", resolve);
    });
  }

  setExecuted(result: T): void {
    this._executionResult = result;
    this._isExecuted = true;
    this._result = result;
    this.eventEmitter.emit("executed", result);
  }
}
