// @flow

import { CancelToken } from "./CancelToken";

export interface Parser<T> {
  parse(CancelToken): Promise<T>;
}
