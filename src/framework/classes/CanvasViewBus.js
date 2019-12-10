// @flow

import { default as CanvasViewException } from "./Exception/CanvasView";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasView } from "../interfaces/CanvasView";
import type { CanvasViewBus as CanvasViewBusInterface } from "../interfaces/CanvasViewBus";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { Scheduler } from "../interfaces/Scheduler";

export default class CanvasViewBus implements CanvasViewBusInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scheduler: Scheduler;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, scheduler: Scheduler) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scheduler = scheduler;
  }

  async add(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    if (canvasView.isAttached()) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("add"), "Canvas view is already attached and cannot be attached again.");
    }

    await canvasView.attach(cancelToken);

    if (canvasView.useBegin()) {
      this.scheduler.onBegin(canvasView.begin);
    }
    if (canvasView.useEnd()) {
      this.scheduler.onEnd(canvasView.end);
    }
    if (canvasView.useUpdate()) {
      this.scheduler.onUpdate(canvasView.update);
    }
  }

  async delete(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    if (canvasView.useBegin()) {
      this.scheduler.offBegin(canvasView.begin);
    }
    if (canvasView.useEnd()) {
      this.scheduler.offEnd(canvasView.end);
    }
    if (canvasView.useUpdate()) {
      this.scheduler.offUpdate(canvasView.update);
    }

    if (canvasView.isDisposed()) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("delete"), "Canvas view cannot is already disposed and cannot be disposed again.");
    }

    await canvasView.dispose(cancelToken);

    if (!canvasView.isDisposed()) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("delete"), "Canvas view wasn't properly disposed. Did you forget to call parent 'super.dispose' method?");
    }
  }
}
