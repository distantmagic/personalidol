import { CancelToken } from "./CancelToken";

export interface Disposable {
  attach(cancelToken: CancelToken): Promise<void>;

  isAttached(): boolean;

  dispose(cancelToken: CancelToken): Promise<void>;

  isDisposed(): boolean;
}
