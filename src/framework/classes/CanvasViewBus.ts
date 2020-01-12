import { default as CanvasViewException } from "src/framework/classes/Exception/CanvasView";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasView } from "src/framework/interfaces/CanvasView";
import { CanvasViewBus as CanvasViewBusInterface } from "src/framework/interfaces/CanvasViewBus";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { Scheduler } from "src/framework/interfaces/Scheduler";

export default class CanvasViewBus implements CanvasViewBusInterface {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly scheduler: Scheduler;

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
    if (canvasView.useDraw()) {
      this.scheduler.onDraw(canvasView.draw);
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
    if (canvasView.useDraw()) {
      this.scheduler.offDraw(canvasView.draw);
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
