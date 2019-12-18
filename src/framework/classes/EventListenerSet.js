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

  delete(callback: EventListenerSetCallback<Arguments>): void {
    this.callbacks.splice(this.callbacks.indexOf(callback), 1);
  }

  notify(args: Arguments, clearAfter: boolean = false): void {
    for (let callback of this.callbacks) {
      callback(...args);
    }

    if (clearAfter) {
      this.clear();
    }
  }

  async notifyAwait(args: Arguments, clearAfter: boolean = false): Promise<void> {
    await Promise.all(
      this.callbacks.map(callback => {
        return callback(...args);
      })
    );

    if (clearAfter) {
      this.clear();
    }
  }

  clear(): void {
    this.callbacks = [];
  }
}
