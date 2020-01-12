import { CancelToken } from "src/framework/interfaces/CancelToken";

export interface GeneratorParser<T> {
  parse(cancelToken: CancelToken): Generator<T>;
}
