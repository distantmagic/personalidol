// @flow

import type { EventListenerSetCallback } from "../types/EventListenerSetCallback";

export interface EventListenerSet<Arguments: $ReadOnlyArray<any>> {
  add(EventListenerSetCallback<Arguments>): void;

  clear(): void;

  delete(EventListenerSetCallback<Arguments>): void;

  notify(args: Arguments): void;
}
