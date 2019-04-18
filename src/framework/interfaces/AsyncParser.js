// @flow

import { CancelToken } from "./CancelToken";

export interface AsyncParser<T> {
  parse(CancelToken): Promise<T>;
}
