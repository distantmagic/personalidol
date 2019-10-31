// @flow

import type { CanvasView } from "../interfaces/CanvasView";
import type { Scheduler } from "../interfaces/Scheduler";
import type { SchedulerBridge as SchedulerBridgeInterface } from "../interfaces/SchedulerBridge";

export default class SchedulerBridge implements SchedulerBridgeInterface {
  +scheduler: Scheduler;

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
  }

  forward(canvasView: CanvasView): void {
    this.scheduler.onBegin(canvasView.begin);
    this.scheduler.onDraw(canvasView.draw);
    this.scheduler.onEnd(canvasView.end);
    this.scheduler.onUpdate(canvasView.update);
  }

  withdraw(canvasView: CanvasView): void {
    this.scheduler.offBegin(canvasView.begin);
    this.scheduler.offDraw(canvasView.draw);
    this.scheduler.offEnd(canvasView.end);
    this.scheduler.offUpdate(canvasView.update);
  }
}
