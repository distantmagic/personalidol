// @flow strict

import type { CancelToken } from "./CancelToken";
import type { EventListenerSetCallback } from "../types/EventListenerSetCallback";

export interface EventListenerGenerator<Arguments: $ReadOnlyArray<any>> {
  generate(CancelToken): AsyncGenerator<Arguments, void, void>;
}
