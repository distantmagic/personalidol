import type CancelToken from "src/framework/interfaces/CancelToken";

export default interface Disposable {
  attach(cancelToken: CancelToken): Promise<void>;

  isAttached(): boolean;

  dispose(cancelToken: CancelToken): Promise<void>;

  isDisposed(): boolean;
}
