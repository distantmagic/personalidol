import CancelToken from "src/framework/interfaces/CancelToken";

export default interface GeneratorParser<T> {
  parse(cancelToken: CancelToken): Generator<T>;
}
