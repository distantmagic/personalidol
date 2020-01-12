import { EventListenerSetCallback } from "src/framework/types/EventListenerSetCallback";

export interface EventListenerSet<Arguments extends readonly any[]> {
  add(eventListenerSetCallback: EventListenerSetCallback<Arguments>): void;

  clear(): void;

  delete(eventListenerSetCallback: EventListenerSetCallback<Arguments>): void;

  getCallbacks(): ReadonlyArray<EventListenerSetCallback<Arguments>>;

  notify(args: Arguments): void;
}
