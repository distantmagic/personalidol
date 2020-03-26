import type Query from "src/framework/interfaces/Query";

export default interface CancelTokenQuery<T> {
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
