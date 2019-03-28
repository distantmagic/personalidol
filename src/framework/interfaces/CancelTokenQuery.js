// @flow

import type { CancelToken } from "./CancelToken";
import type { Equatable } from "./Equatable";
import type { Query } from "./Query";

export interface CancelTokenQuery<T> extends Equatable<CancelTokenQuery<T>> {
  constructor(cancelToken: CancelToken, query: Query<T>): void;

  execute(): Promise<?T>;

  getQuery(): Query<T>;

  getResult(): T;

  isCancelled(): boolean;

  isExecuted(): boolean;

  onExecuted(): Promise<?T>;

  setExecuted(result: ?T): void;
}
