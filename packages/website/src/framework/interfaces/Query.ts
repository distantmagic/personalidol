import type CancelToken from "src/framework/interfaces/CancelToken";
import type Equatable from "src/framework/interfaces/Equatable";

export default interface Query<T> extends Equatable<Query<T>> {
  execute(cancelToken: CancelToken): Promise<T>;

  getQueryType(): string;
}
