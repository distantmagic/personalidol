import { CancelToken } from "src/framework/interfaces/CancelToken";
import { Query as QueryInterface } from "src/framework/interfaces/Query";

export default abstract class Query<T> implements QueryInterface<T> {
  abstract execute(cancelToken: CancelToken): Promise<T>;

  abstract isEqual(other: QueryInterface<T>): boolean;
}
