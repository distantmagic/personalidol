import type CancelToken from "src/framework/interfaces/CancelToken";

export default interface EventListenerGenerator<Arguments extends readonly any[]> {
  generate(cancelToken: CancelToken): AsyncGenerator<Arguments>;
}
