// @flow

import type { CancelToken } from "./CancelToken";

export interface Disposable {
  attach(CancelToken): Promise<void>;

  dispose(CancelToken): Promise<void>;
}
