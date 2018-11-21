// @flow

import AlreadyRejected from "./Exception/QueryObserver/AlreadyRejected";
import AlreadyResolved from "./Exception/QueryObserver/AlreadyResolved";
import Query from "./Query";

type ResolveResult<U> = U;

export default class QueryObserver<T> {
  _isRejected: boolean;
  _isResolved: boolean;
  _promise: Promise<T>;
  _reject: (error: any) => void;
  _resolve: (result: ResolveResult<T>) => void;
  query: Query<T>;

  constructor(query: Query<T>) {
    this.query = query;
    this._promise = new Promise<T>((resolve, reject) => {
      this._reject = reject;
      this._resolve = resolve;
    });
  }

  await(): Promise<T> {
    return this._promise;
  }

  reject(error: any): void {
    if (this._isRejected) {
      throw new AlreadyRejected();
    }

    this._reject(error);
    this._isRejected = true;
  }

  resolve(result: ResolveResult<T>): void {
    if (this._isResolved) {
      throw new AlreadyResolved();
    }

    this._resolve(result);
    this._isResolved = true;
  }
}
