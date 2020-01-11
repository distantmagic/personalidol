import { CancelToken } from "./CancelToken";
import { Equatable } from "./Equatable";

export interface Query<T> extends Equatable<Query<T>> {
  execute(cancelToken: CancelToken): Promise<T>;
}
