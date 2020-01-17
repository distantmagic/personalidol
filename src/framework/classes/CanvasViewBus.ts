import isEmpty from "lodash/isEmpty";

import { default as CanvasViewException } from "src/framework/classes/Exception/CanvasView";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasView from "src/framework/interfaces/CanvasView";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import Scheduler from "src/framework/interfaces/Scheduler";
import { default as ICanvasViewBus } from "src/framework/interfaces/CanvasViewBus";

export default class CanvasViewBus implements ICanvasViewBus {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly scheduler: Scheduler;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, scheduler: Scheduler) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scheduler = scheduler;
  }

  async add(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    const canvasViewName: string = canvasView.getName();

    if (canvasView.isAttached()) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("add"), `Canvas view is already attached and cannot be attached again: ${canvasViewName}`);
    }

    await canvasView.attach(cancelToken);

    if (!canvasView.isAttached()) {
      throw new CanvasViewException(
        this.loggerBreadcrumbs.add("add"),
        `Canvas view is not properly attached. Did you forget to call parent 'super.attach' method?: ${canvasViewName}`
      );
    }

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
    const canvasViewName: string = canvasView.getName();

    if (canvasView.isDisposed()) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("delete"), `Canvas view cannot is already disposed and cannot be disposed again: ${canvasViewName}`);
    }

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

    await canvasView.dispose(cancelToken);

    if (!canvasView.isDisposed()) {
      throw new CanvasViewException(
        this.loggerBreadcrumbs.add("delete"),
        `Canvas view wasn't properly disposed. Did you forget to call parent 'super.dispose' method?: ${canvasViewName}`
      );
    }

    if (!isEmpty(canvasView.getChildren().children)) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("delete"), `Canvas view is not properly disposed. It still contains attached children: ${canvasViewName}`);
    }
  }
}
