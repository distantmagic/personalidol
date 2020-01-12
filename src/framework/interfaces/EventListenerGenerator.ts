import { CancelToken } from "src/framework/interfaces/CancelToken";
import { EventListenerSetCallback } from "src/framework/types/EventListenerSetCallback";

export interface EventListenerGenerator<Arguments extends readonly any[]> {
  generate(cancelToken: CancelToken): AsyncGenerator<Arguments, void, void>;
}
