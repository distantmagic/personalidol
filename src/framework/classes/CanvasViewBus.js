// @flow

import type { CanvasView } from "../interfaces/CanvasView";
import type { CanvasViewBus as CanvasViewBusInterface } from "../interfaces/CanvasViewBus";
import type { Scheduler } from "../interfaces/Scheduler";

export default class CanvasViewBus implements CanvasViewBusInterface {
  +scheduler: Scheduler;

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
  }

  add(canvasView: CanvasView): void {
    canvasView.attach();
    this.scheduler.onBegin(canvasView.begin);
    this.scheduler.onEnd(canvasView.end);
    this.scheduler.onUpdate(canvasView.update);
  }

  delete(canvasView: CanvasView): void {
    this.scheduler.offBegin(canvasView.begin);
    this.scheduler.offEnd(canvasView.end);
    this.scheduler.offUpdate(canvasView.update);
    canvasView.dispose();
  }
}
