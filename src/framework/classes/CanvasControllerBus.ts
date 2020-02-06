import autoBind from "auto-bind";

import { default as CanvasControllerException } from "src/framework/classes/Exception/CanvasController";

import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasController from "src/framework/interfaces/CanvasController";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import HTMLElementSizeObserver from "src/framework/interfaces/HTMLElementSizeObserver";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import Scheduler from "src/framework/interfaces/Scheduler";
import { default as ICanvasControllerBus } from "src/framework/interfaces/CanvasControllerBus";
import { default as IElementSize } from "src/framework/interfaces/ElementSize";

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

    await canvasController.attach(cancelToken);

    if (!canvasController.isAttached()) {
      throw new CanvasControllerException(this.loggerBreadcrumbs.add("add"), "Canvas controller wasn't properly attached. Did you forget to call parent 'super.attach' method?");
    }

    this.resizeObserver.onResize.add(canvasController.resize);

    const lastElementSize = this.lastElementSize;

    if (lastElementSize) {
      canvasController.resize(lastElementSize);
    }

    if (SchedulerUpdateScenario.Always === canvasController.useBegin()) {
      this.scheduler.onBegin(canvasController.begin);
    }
    if (SchedulerUpdateScenario.Always === canvasController.useDraw()) {
      this.scheduler.onDraw(canvasController.draw);
    }
    if (SchedulerUpdateScenario.Always === canvasController.useEnd()) {
      this.scheduler.onEnd(canvasController.end);
    }
    if (SchedulerUpdateScenario.Always === canvasController.useUpdate()) {
      this.scheduler.onUpdate(canvasController.update);
    }
  }

  @cancelable()
  async delete(cancelToken: CancelToken, canvasController: CanvasController): Promise<void> {
    if (canvasController.isDisposed()) {
      throw new CanvasControllerException(this.loggerBreadcrumbs.add("delete"), "Canvas controller cannot is already disposed and cannot be disposed again.");
    }

    if (SchedulerUpdateScenario.Always === canvasController.useBegin()) {
      this.scheduler.offBegin(canvasController.begin);
    }
    if (SchedulerUpdateScenario.Always === canvasController.useDraw()) {
      this.scheduler.offDraw(canvasController.draw);
    }
    if (SchedulerUpdateScenario.Always === canvasController.useEnd()) {
      this.scheduler.offEnd(canvasController.end);
    }
    if (SchedulerUpdateScenario.Always === canvasController.useUpdate()) {
      this.scheduler.offUpdate(canvasController.update);
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
