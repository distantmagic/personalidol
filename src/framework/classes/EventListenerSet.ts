import Exception from "./Exception";

import { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import { EventListenerSetCallback } from "../types/EventListenerSetCallback";
import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class EventListenerSet<Arguments extends readonly any[]> implements EventListenerSetInterface<Arguments> {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  private callbacks: EventListenerSetCallback<Arguments>[];

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.callbacks = [];
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  add(callback: EventListenerSetCallback<Arguments>): void {
    this.callbacks.push(callback);
  }

  clear(): void {
    this.callbacks = [];
  }

  delete(callback: EventListenerSetCallback<Arguments>): void {
    const indexOf = this.callbacks.indexOf(callback);

    if (indexOf === -1) {
      throw new Exception(this.loggerBreadcrumbs.add("delete"), "Callback is not a part of event listener set but it was expected to be.");
    }

    this.callbacks.splice(indexOf, 1);
  }

  notify(args: Arguments): void {
    // optimize unwinding function calls
    // this method is called each animation frame, so every milisecond matters
    switch (args.length) {
      case 0:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i].call(null);
        }
        break;
      case 1:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i].call(null, args[0]);
        }
        break;
      case 2:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i].call(null, args[0], args[1]);
        }
        break;
      case 3:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i].call(null, args[0], args[1], args[2]);
        }
        break;
      case 4:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i].call(null, args[0], args[1], args[2], args[3]);
        }
        break;
      case 5:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i].call(null, args[0], args[1], args[2], args[3], args[4]);
        }
        break;
      default:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i].call(null, ...args);
        }
        break;
    }
  }
}
