// @flow

import type { CanvasController } from "../interfaces/CanvasController";
import type { CanvasControllerBus as CanvasControllerBusInterface } from "../interfaces/CanvasControllerBus";
import type { Scheduler } from "../interfaces/Scheduler";

export default class CanvasControllerBus implements CanvasControllerBusInterface {
  +scheduler: Scheduler;

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
  }

  add(canvasController: CanvasController): void {
    this.scheduler.onDraw(canvasController.draw);
  }

  delete(canvasController: CanvasController): void {
    this.scheduler.offDraw(canvasController.draw);
  }
}
