import { default as CanvasControllerException } from "src/framework/classes/Exception/CanvasController";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasController } from "src/framework/interfaces/CanvasController";
import { CanvasControllerBus as CanvasControllerBusInterface } from "src/framework/interfaces/CanvasControllerBus";
import { HTMLElementResizeObserver } from "src/framework/interfaces/HTMLElementResizeObserver";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { Scheduler } from "src/framework/interfaces/Scheduler";

export default class CanvasControllerBus implements CanvasControllerBusInterface {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly resizeObserver: HTMLElementResizeObserver;
  readonly scheduler: Scheduler;

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

    if (!canvasController.isAttached()) {
      throw new CanvasControllerException(this.loggerBreadcrumbs.add("add"), "Canvas controller wasn't properly attached. Did you forget to call parent 'super.attach' method?");
    }

    this.resizeObserver.notify(canvasController);

    if (canvasController.useBegin()) {
      this.scheduler.onBegin(canvasController.begin);
    }
    if (canvasController.useDraw()) {
      this.scheduler.onDraw(canvasController.draw);
    }
    if (canvasController.useEnd()) {
      this.scheduler.onEnd(canvasController.end);
    }
    if (canvasController.useUpdate()) {
      this.scheduler.onUpdate(canvasController.update);
    }
  }

  async delete(cancelToken: CancelToken, canvasController: CanvasController): Promise<void> {
    if (canvasController.isDisposed()) {
      throw new CanvasControllerException(this.loggerBreadcrumbs.add("delete"), "Canvas controller cannot is already disposed and cannot be disposed again.");
    }

    if (canvasController.useBegin()) {
      this.scheduler.offBegin(canvasController.begin);
    }
    if (canvasController.useDraw()) {
      this.scheduler.offDraw(canvasController.draw);
    }
    if (canvasController.useEnd()) {
      this.scheduler.offEnd(canvasController.end);
    }
    if (canvasController.useUpdate()) {
      this.scheduler.offUpdate(canvasController.update);
    }

    this.resizeObserver.off(canvasController);

    await canvasController.dispose(cancelToken);

    if (!canvasController.isDisposed()) {
      throw new CanvasControllerException(
        this.loggerBreadcrumbs.add("delete"),
        "Canvas controller wasn't properly disposed. Did you forget to call parent 'super.dispose' method?"
      );
    }
  }
}
