import { CancelToken } from "./CancelToken";
import { Query } from "./Query";

export interface CancelTokenQuery<T> {
  // constructor(cancelToken: CancelToken, query: Query<T>): void;

  execute(): Promise<T>;

  getQuery(): Query<T>;

  getResult(): T;

  infer(cancelTokenQuery: CancelTokenQuery<T>): T;

  isInferableFrom<T>(cancelTokenQuery: CancelTokenQuery<T>): boolean;

  isCanceled(): boolean;

  isExecuted(): boolean;

  isExecuting(): boolean;

  setExecuted(result: T): void;

  whenExecuted(): Promise<T>;
}
