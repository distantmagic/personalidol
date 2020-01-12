import { CancelToken } from "src/framework/interfaces/CancelToken";

export interface Disposable {
  attach(cancelToken: CancelToken): Promise<void>;

  isAttached(): boolean;

  dispose(cancelToken: CancelToken): Promise<void>;

  isDisposed(): boolean;
}
