import CancelToken from "src/framework/interfaces/CancelToken";
import { default as IQuery } from "src/framework/interfaces/Query";

export default abstract class Query<T> implements IQuery<T> {
  abstract execute(cancelToken: CancelToken): Promise<T>;

  abstract getQueryUUID(): string;

  abstract isEqual(other: IQuery<T>): boolean;
}
