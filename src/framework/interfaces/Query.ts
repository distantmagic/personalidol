import { CancelToken } from "src/framework/interfaces/CancelToken";
import { Equatable } from "src/framework/interfaces/Equatable";

export interface Query<T> extends Equatable<Query<T>> {
  execute(cancelToken: CancelToken): Promise<T>;
}
