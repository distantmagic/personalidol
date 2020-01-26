import autoBind from "auto-bind";

import { default as CanvasControllerException } from "src/framework/classes/Exception/CanvasController";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasController from "src/framework/interfaces/CanvasController";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import HTMLElementPositionObserver from "src/framework/interfaces/HTMLElementPositionObserver";
import HTMLElementSizeObserver from "src/framework/interfaces/HTMLElementSizeObserver";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import Scheduler from "src/framework/interfaces/Scheduler";
import { default as ICanvasControllerBus } from "src/framework/interfaces/CanvasControllerBus";
import { default as IElementPosition } from "src/framework/interfaces/ElementPosition";
import { default as IElementSize } from "src/framework/interfaces/ElementSize";

export default class CanvasControllerBus implements ICanvasControllerBus, HasLoggerBreadcrumbs {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly positionObserver: HTMLElementPositionObserver;
  readonly resizeObserver: HTMLElementSizeObserver;
  readonly scheduler: Scheduler;
  private lastElementPosition: null | IElementPosition<"px"> = null;
  private lastElementSize: null | IElementSize<"px"> = null;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, positionObserver: HTMLElementPositionObserver, resizeObserver: HTMLElementSizeObserver, scheduler: Scheduler) {
    autoBind(this);

    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.positionObserver = positionObserver;
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

    this.positionObserver.eventDispatcher.add(canvasController.setPosition);
    this.resizeObserver.eventDispatcher.add(canvasController.resize);

    // catch up with last events
    const lastElementPosition = this.lastElementPosition;
    const lastElementSize = this.lastElementSize;

    if (lastElementPosition) {
      canvasController.setPosition(lastElementPosition);
    }

    if (lastElementSize) {
      canvasController.resize(lastElementSize);
    }

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

  @cancelable()
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

    this.positionObserver.eventDispatcher.delete(canvasController.setPosition);
    this.resizeObserver.eventDispatcher.delete(canvasController.resize);

    await canvasController.dispose(cancelToken);

    if (!canvasController.isDisposed()) {
      throw new CanvasControllerException(
        this.loggerBreadcrumbs.add("delete"),
        "Canvas controller wasn't properly disposed. Did you forget to call parent 'super.dispose' method?"
      );
    }
  }

  disconnect(): void {
    this.positionObserver.eventDispatcher.delete(this.setPosition);
    this.resizeObserver.eventDispatcher.delete(this.resize);
  }

  observe(): void {
    this.positionObserver.eventDispatcher.add(this.setPosition);
    this.resizeObserver.eventDispatcher.add(this.resize);
  }

  setPosition(elementPosition: IElementPosition<"px">): void {
    this.lastElementPosition = elementPosition;
  }

  resize(elementSize: IElementSize<"px">): void {
    this.lastElementSize = elementSize;
  }
}
