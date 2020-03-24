import autoBind from "auto-bind";

import { default as CanvasControllerException } from "src/framework/classes/Exception/CanvasController";

import cancelable from "src/framework/decorators/cancelable";

import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasController from "src/framework/interfaces/CanvasController";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type HTMLElementSizeObserver from "src/framework/interfaces/HTMLElementSizeObserver";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type Scheduler from "src/framework/interfaces/Scheduler";
import type { default as ICanvasControllerBus } from "src/framework/interfaces/CanvasControllerBus";
import type { default as IElementSize } from "src/framework/interfaces/ElementSize";

export default class CanvasControllerBus implements ICanvasControllerBus, HasLoggerBreadcrumbs {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly resizeObserver: HTMLElementSizeObserver;
  readonly scheduler: Scheduler;
  private lastElementSize: null | IElementSize<ElementPositionUnit.Px> = null;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, resizeObserver: HTMLElementSizeObserver, scheduler: Scheduler) {
    autoBind(this);

    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.resizeObserver = resizeObserver;
    this.scheduler = scheduler;
  }

  @cancelable()
  async add(cancelToken: CancelToken, canvasController: CanvasController): Promise<void> {
    if (canvasController.isAttached()) {
      throw new CanvasControllerException(this.loggerBreadcrumbs.add("add"), "Canvas controller is already attached and cannot be attached again.");
    }

    this.resizeObserver.onResize.add(canvasController.resize);

    await canvasController.attach(cancelToken);

    const lastElementSize = this.lastElementSize;

    if (lastElementSize) {
      canvasController.resize(lastElementSize);
    }

    if (!canvasController.isAttached()) {
      throw new CanvasControllerException(this.loggerBreadcrumbs.add("add"), "Canvas controller wasn't properly attached. Did you forget to call parent 'super.attach' method?");
    }

    if (SchedulerUpdateScenario.Always === canvasController.useDraw()) {
      this.scheduler.draw.add(canvasController.draw);
    }
    if (SchedulerUpdateScenario.Always === canvasController.useUpdate()) {
      this.scheduler.update.add(canvasController.update);
    }
  }

  @cancelable()
  async delete(cancelToken: CancelToken, canvasController: CanvasController): Promise<void> {
    if (canvasController.isDisposed()) {
      throw new CanvasControllerException(this.loggerBreadcrumbs.add("delete"), "Canvas controller cannot is already disposed and cannot be disposed again.");
    }

    if (SchedulerUpdateScenario.Always === canvasController.useDraw()) {
      this.scheduler.draw.delete(canvasController.draw);
    }
    if (SchedulerUpdateScenario.Always === canvasController.useUpdate()) {
      this.scheduler.update.delete(canvasController.update);
    }

    this.resizeObserver.onResize.delete(canvasController.resize);

    await canvasController.dispose(cancelToken);

    if (!canvasController.isDisposed()) {
      throw new CanvasControllerException(
        this.loggerBreadcrumbs.add("delete"),
        "Canvas controller wasn't properly disposed. Did you forget to call parent 'super.dispose' method?"
      );
    }
  }

  disconnect(): void {
    this.resizeObserver.onResize.delete(this.resize);
  }

  observe(): void {
    this.resizeObserver.onResize.add(this.resize);
  }

  resize(elementSize: IElementSize<ElementPositionUnit.Px>): void {
    this.lastElementSize = elementSize;
  }
}
