import type EventListenerSetCallback from "src/framework/types/EventListenerSetCallback";

export default interface EventListenerSet<Arguments extends readonly any[]> {
  add(eventListenerSetCallback: EventListenerSetCallback<Arguments>): void;

  clear(): void;

  delete(eventListenerSetCallback: EventListenerSetCallback<Arguments>): void;

  getCallbacks(): ReadonlyArray<EventListenerSetCallback<Arguments>>;

  has(eventListenerSetCallback: EventListenerSetCallback<Arguments>): boolean;

  notify(args: Arguments): void;
}
