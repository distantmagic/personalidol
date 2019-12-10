// @flow

import type { CancelToken } from "./CancelToken";

export interface Disposable {
  attach(CancelToken): Promise<void>;

  isAttached(): boolean;

  dispose(CancelToken): Promise<void>;

  isDisposed(): boolean;
}
