import CancelToken from "src/framework/interfaces/CancelToken";
import Equatable from "src/framework/interfaces/Equatable";

export default interface Query<T> extends Equatable<Query<T>> {
  execute(cancelToken: CancelToken): Promise<T>;

  getQueryUUID(): string;
}
