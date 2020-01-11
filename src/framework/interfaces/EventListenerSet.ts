import { EventListenerSetCallback } from "../types/EventListenerSetCallback";

export interface EventListenerSet<Arguments extends readonly any[]> {
  add(eventListenerSetCallback: EventListenerSetCallback<Arguments>): void;

  clear(): void;

  delete(eventListenerSetCallback: EventListenerSetCallback<Arguments>): void;

  notify(args: Arguments): void;
}
