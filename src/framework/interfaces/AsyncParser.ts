import { CancelToken } from "src/framework/interfaces/CancelToken";

export interface AsyncParser<T> {
  parse(cancelToken: CancelToken): Promise<T>;
}
