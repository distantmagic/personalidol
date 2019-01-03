// @flow

import type { CancelToken } from "./CancelToken";
import type { Equatable } from "./Equatable";

export interface Query<T> extends Equatable<Query<T>> {
  execute(cancelToken: CancelToken): Promise<T>;
}
