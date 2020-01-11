import { CancelToken } from "./CancelToken";
import { EventListenerSetCallback } from "../types/EventListenerSetCallback";

export interface EventListenerGenerator<Arguments extends readonly any[]> {
  generate(cancelToken: CancelToken): AsyncGenerator<Arguments, void, void>;
}
