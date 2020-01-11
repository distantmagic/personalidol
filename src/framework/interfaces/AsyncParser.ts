import { CancelToken } from "./CancelToken";

export interface AsyncParser<T> {
  parse(cancelToken: CancelToken): Promise<T>;
}
