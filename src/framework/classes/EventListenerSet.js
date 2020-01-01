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
    // optimize unwinding function calls
    // this method is called each animation frame, so every milisecond matters
    switch (args.length) {
      case 0:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // $FlowFixMe
          this.callbacks[i].call(null);
        }
        break;
      case 1:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // $FlowFixMe
          this.callbacks[i].call(null, args[0]);
        }
        break;
      case 2:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // $FlowFixMe
          this.callbacks[i].call(null, args[0], args[1]);
        }
        break;
      case 3:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // $FlowFixMe
          this.callbacks[i].call(null, args[0], args[1], args[2]);
        }
        break;
      case 4:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // $FlowFixMe
          this.callbacks[i].call(null, args[0], args[1], args[2], args[3]);
        }
        break;
      case 5:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // $FlowFixMe
          this.callbacks[i].call(null, args[0], args[1], args[2], args[3], args[4]);
        }
        break;
      default:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // $FlowFixMe
          this.callbacks[i].call(null, ...args);
        }
        break;
    }
  }
}
