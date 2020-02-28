import autoBind from "auto-bind";

import EventListenerSet from "src/framework/classes/EventListenerSet";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";
import { default as IScheduler } from "src/framework/interfaces/Scheduler";

export default class Scheduler implements IScheduler {
  readonly draw: IEventListenerSet<[number]>;
  readonly update: IEventListenerSet<[number]>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.draw = new EventListenerSet<[number]>(loggerBreadcrumbs.add("EventListenerSet").add("draw"));
    this.update = new EventListenerSet<[number]>(loggerBreadcrumbs.add("EventListenerSet").add("update"));
  }
}
