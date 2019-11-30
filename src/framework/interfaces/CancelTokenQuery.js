// @flow

import type { CancelToken } from "./CancelToken";
import type { Query } from "./Query";

export interface CancelTokenQuery<T> {
  // constructor(cancelToken: CancelToken, query: Query<T>): void;

  execute(): Promise<T>;

  getQuery(): Query<T>;

  getResult(): T;

  infer(CancelTokenQuery<T>): T;

  isInferableFrom(CancelTokenQuery<any>): boolean;

  isCanceled(): boolean;

  isExecuted(): boolean;

  isExecuting(): boolean;

  onExecuted(): Promise<?T>;

  setExecuted(result: T): void;
}
