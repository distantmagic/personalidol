// @flow strict

import { CancelToken } from "./CancelToken";

export interface GeneratorParser<T> {
  parse(CancelToken): Generator<T, void, void>;
}
