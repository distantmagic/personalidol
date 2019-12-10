// @flow

import type { CancelToken } from "./CancelToken";

export interface Disposable {
  attach(CancelToken): Promise<void>;

  isAttached(): bool;

  dispose(CancelToken): Promise<void>;

  isDisposed(): bool;
}
