// @flow

import { default as CanvasControllerException } from "./Exception/CanvasController";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasController } from "../interfaces/CanvasController";
import type { CanvasControllerBus as CanvasControllerBusInterface } from "../interfaces/CanvasControllerBus";
import type { HTMLElementResizeObserver } from "../interfaces/HTMLElementResizeObserver";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Scheduler } from "../interfaces/Scheduler";

export default class CanvasControllerBus implements CanvasControllerBusInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +resizeObserver: HTMLElementResizeObserver;
  +scheduler: Scheduler;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, resizeObserver: HTMLElementResizeObserver, scheduler: Scheduler) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.resizeObserver = resizeObserver;
    this.scheduler = scheduler;
  }

  async add(cancelToken: CancelToken, canvasController: CanvasController): Promise<void> {
    if (canvasController.isAttached()) {
      throw new CanvasControllerException(this.loggerBreadcrumbs.add("add"), "Canvas controller is already attached and cannot be attached again.");
    }

    await canvasController.attach(cancelToken);

    this.resizeObserver.notify(canvasController);
    this.scheduler.onDraw(canvasController.draw);
    this.scheduler.onEnd(canvasController.end);
  }

  async delete(cancelToken: CancelToken, canvasController: CanvasController): Promise<void> {
    this.resizeObserver.off(canvasController);
    this.scheduler.offDraw(canvasController.draw);
    this.scheduler.offEnd(canvasController.end);

    if (canvasController.isDisposed()) {
      throw new CanvasControllerException(this.loggerBreadcrumbs.add("delete"), "Canvas controller cannot is already disposed and cannot be disposed again.");
    }

    await canvasController.dispose(cancelToken);

    if (!canvasController.isDisposed()) {
      throw new CanvasControllerException(
        this.loggerBreadcrumbs.add("delete"),
        "Canvas controller wasn't properly disposed. Did you forget to call parent 'super.dispose' method?"
      );
    }
  }
}
