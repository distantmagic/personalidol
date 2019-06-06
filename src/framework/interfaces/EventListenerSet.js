// @flow

import type { EventListenerSetCallback } from "../types/EventListenerSetCallback";

export interface EventListenerSet<Arguments: $ReadOnlyArray<any>> {
  add(EventListenerSetCallback<Arguments>): void;

  delete(EventListenerSetCallback<Arguments>): void;

  notify(args: Arguments, clearAfter?: boolean): void;

  notifyAwait(args: Arguments, clearAfter?: boolean): Promise<void>;

  clear(): void;
}
