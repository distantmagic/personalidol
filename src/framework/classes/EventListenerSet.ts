import Exception from "src/framework/classes/Exception";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";

import EventListenerSetCallback from "src/framework/types/EventListenerSetCallback";

export default class EventListenerSet<Arguments extends readonly any[]> implements HasLoggerBreadcrumbs, IEventListenerSet<Arguments> {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  private callbacks: EventListenerSetCallback<Arguments>[] = [];

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  add(callback: EventListenerSetCallback<Arguments>): void {
    if (this.callbacks.includes(callback)) {
      throw new Exception(this.loggerBreadcrumbs.add("add"), "Callback is already registered in EventListenerSet.");
    }

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

  getCallbacks(): ReadonlyArray<EventListenerSetCallback<Arguments>> {
    return this.callbacks;
  }

  has(callback: EventListenerSetCallback<Arguments>): boolean {
    return this.getCallbacks().includes(callback);
  }

  notify(args: Arguments): void {
    // optimize unwinding function calls
    // this method may be called each animation frame, so every milisecond
    // matters
    // see also: https://jsperf.com/function-calls-with-spread-vs-call-vs-apply
    switch (args.length) {
      case 0:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i]();
        }
        break;
      case 1:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i](args[0]);
        }
        break;
      case 2:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i](args[0], args[1]);
        }
        break;
      case 3:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i](args[0], args[1], args[2]);
        }
        break;
      default:
        for (let i = 0; i < this.callbacks.length; i += 1) {
          // @ts-ignore
          this.callbacks[i].apply(null, args);
        }
        break;
    }
  }
}
