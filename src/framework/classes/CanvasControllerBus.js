// @flow

import type { CanvasController } from "../interfaces/CanvasController";
import type { CanvasControllerBus as CanvasControllerBusInterface } from "../interfaces/CanvasControllerBus";
import type { HTMLElementResizeObserver } from "../interfaces/HTMLElementResizeObserver";
import type { Scheduler } from "../interfaces/Scheduler";

export default class CanvasControllerBus implements CanvasControllerBusInterface {
  +resizeObserver: HTMLElementResizeObserver;
  +scheduler: Scheduler;

  constructor(resizeObserver: HTMLElementResizeObserver, scheduler: Scheduler) {
    this.resizeObserver = resizeObserver;
    this.scheduler = scheduler;
  }

  async add(canvasController: CanvasController): Promise<void> {
    await canvasController.attach();

    this.resizeObserver.notify(canvasController);
    this.scheduler.onDraw(canvasController.draw);
    this.scheduler.onEnd(canvasController.end);
  }

  delete(canvasController: CanvasController): Promise<void> {
    this.resizeObserver.off(canvasController);
    this.scheduler.offDraw(canvasController.draw);
    this.scheduler.offEnd(canvasController.end);

    return canvasController.dispose();
  }
}
