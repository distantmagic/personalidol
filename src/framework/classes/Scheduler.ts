// @flow strict

import autoBind from "auto-bind";

import EventListenerSet from "./EventListenerSet";

import type { BeginCallback, DrawCallback, EndCallback, UpdateCallback } from "mainloop.js";

import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { Scheduler as SchedulerInterface } from "../interfaces/Scheduler";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class Scheduler implements SchedulerInterface {
  +beginCallbacks: EventListenerSetInterface<[]>;
  +drawCallbacks: EventListenerSetInterface<[number]>;
  +endCallbacks: EventListenerSetInterface<[number, boolean]>;
  +updateCallbacks: EventListenerSetInterface<[number]>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.beginCallbacks = new EventListenerSet<[]>(loggerBreadcrumbs);
    this.drawCallbacks = new EventListenerSet<[number]>(loggerBreadcrumbs);
    this.endCallbacks = new EventListenerSet<[number, boolean]>(loggerBreadcrumbs);
    this.updateCallbacks = new EventListenerSet<[number]>(loggerBreadcrumbs);
  }

  notifyBegin(): void {
    this.beginCallbacks.notify([]);
  }

  notifyDraw(interpolationPercentage: number): void {
    this.drawCallbacks.notify([interpolationPercentage]);
  }

  notifyEnd(fps: number, isPanicked: boolean): void {
    this.endCallbacks.notify([fps, isPanicked]);
  }

  notifyUpdate(delta: number): void {
    this.updateCallbacks.notify([delta]);
  }

  offBegin(callback: BeginCallback): void {
    this.beginCallbacks.delete(callback);
  }

  offDraw(callback: DrawCallback): void {
    this.drawCallbacks.delete(callback);
  }

  offEnd(callback: EndCallback): void {
    this.endCallbacks.delete(callback);
  }

  offUpdate(callback: UpdateCallback): void {
    this.updateCallbacks.delete(callback);
  }

  onBegin(callback: BeginCallback): void {
    this.beginCallbacks.add(callback);
  }

  onDraw(callback: DrawCallback): void {
    this.drawCallbacks.add(callback);
  }

  onEnd(callback: EndCallback): void {
    this.endCallbacks.add(callback);
  }

  onUpdate(callback: UpdateCallback): void {
    this.updateCallbacks.add(callback);
  }
}
