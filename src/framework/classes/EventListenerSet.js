// @flow

import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { EventListenerSetCallback } from "../types/EventListenerSetCallback";

export default class EventListenerSet<Arguments: $ReadOnlyArray<any>> implements EventListenerSetInterface<Arguments> {
  +callbacks: Set<EventListenerSetCallback<Arguments>>;

  constructor(): void {
    this.callbacks = new Set<EventListenerSetCallback<Arguments>>();
  }

  add(callback: EventListenerSetCallback<Arguments>): void {
    this.callbacks.add(callback);
  }

  delete(callback: EventListenerSetCallback<Arguments>): void {
    this.callbacks.delete(callback);
  }

  notify(args: Arguments, clearAfter: boolean = false): void {
    for (let callback of this.callbacks.values()) {
      callback(...args);
    }

    if (clearAfter) {
      this.clear();
    }
  }

  async notifyAwait(args: Arguments, clearAfter: boolean = false): Promise<void> {
    const callbacks = Array.from(this.callbacks.values());

    if (clearAfter) {
      this.clear();
    }

    await Promise.all(
      callbacks.map(callback => {
        return callback(...args);
      })
    );
  }

  clear(): void {
    this.callbacks.clear();
  }
}
