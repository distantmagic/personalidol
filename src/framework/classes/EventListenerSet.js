// @flow

import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { EventListenerSetCallback } from "../types/EventListenerSetCallback";

export default class EventListenerSet<Arguments: $ReadOnlyArray<any>> implements EventListenerSetInterface<Arguments> {
  callbacks: EventListenerSetCallback<Arguments>[];

  constructor(): void {
    this.callbacks = [];
  }

  add(callback: EventListenerSetCallback<Arguments>): void {
    this.callbacks.push(callback);
  }

  clear(): void {
    this.callbacks = [];
  }

  delete(callback: EventListenerSetCallback<Arguments>): void {
    this.callbacks.splice(this.callbacks.indexOf(callback), 1);
  }

  notify(args: Arguments): void {
    for (let callback of this.callbacks) {
      callback(...args);
    }
  }
}
