import CancelToken from "src/framework/interfaces/CancelToken";

export default interface AsyncParser<T> {
  parse(cancelToken: CancelToken): Promise<T>;
}
