import autoBind from "auto-bind";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasView from "src/framework/interfaces/CanvasView";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as ICanvasViewBag } from "src/framework/interfaces/CanvasViewBag";
import { default as ICanvasViewBus } from "src/framework/interfaces/CanvasViewBus";

export default class CanvasViewBag implements HasLoggerBreadcrumbs, ICanvasViewBag {
  readonly canvasViewBus: ICanvasViewBus;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly canvasViews: CanvasView[] = [];

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBus: ICanvasViewBus) {
    autoBind(this);

    this.canvasViewBus = canvasViewBus;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  @cancelable()
  add(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    this.canvasViews.push(canvasView);

    return this.canvasViewBus.add(cancelToken, canvasView);
  }

  @cancelable()
  async delete(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    while (this.canvasViews.includes(canvasView)) {
      for (let i = this.canvasViews.length - 1; i >= 0; i -= 1) {
        if (this.canvasViews[i] === canvasView) {
          this.canvasViews.splice(i, 1);
          await this.canvasViewBus.delete(cancelToken, canvasView);
        }
      }
    }
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    for (let canvasView of this.canvasViews.slice().reverse()) {
      await this.delete(cancelToken, canvasView);
    }
  }

  fork(loggerBreadcrumbs: LoggerBreadcrumbs): ICanvasViewBag {
    return new CanvasViewBag(loggerBreadcrumbs, this.canvasViewBus);
  }
}
