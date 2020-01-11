import { CancelToken } from "./CancelToken";

export interface GeneratorParser<T> {
  parse(cancelToken: CancelToken): Generator<T, void, void>;
}
