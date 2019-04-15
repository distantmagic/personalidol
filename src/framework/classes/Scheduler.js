// @flow

import autoBind from "auto-bind";

import type {
  BeginCallback,
  DrawCallback,
  EndCallback,
  UpdateCallback
} from "mainloop.js";

import type { Scheduler as SchedulerInterface } from "../interfaces/Scheduler";

export default class Scheduler implements SchedulerInterface {
  +beginCallbacks: Set<BeginCallback>;
  +drawCallbacks: Set<DrawCallback>;
  +endCallbacks: Set<EndCallback>;
  +updateCallbacks: Set<UpdateCallback>;

  constructor() {
    autoBind(this);

    this.beginCallbacks = new Set<BeginCallback>();
    this.drawCallbacks = new Set<DrawCallback>();
    this.endCallbacks = new Set<EndCallback>();
    this.updateCallbacks = new Set<UpdateCallback>();
  }

  notifyBegin(): void {
    for (let [callback] of this.beginCallbacks.entries()) {
      callback();
    }
  }

  notifyDraw(interpolationPercentage: number): void {
    for (let [callback] of this.drawCallbacks.entries()) {
      callback(interpolationPercentage);
    }
  }

  notifyEnd(fps: number, isPanicked: boolean): void {
    for (let [callback] of this.endCallbacks.entries()) {
      callback(fps, isPanicked);
    }
  }

  notifyUpdate(delta: number): void {
    for (let [callback] of this.updateCallbacks.entries()) {
      callback(delta);
    }
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
