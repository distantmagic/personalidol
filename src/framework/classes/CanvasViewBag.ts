import autoBind from "auto-bind";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasView from "src/framework/interfaces/CanvasView";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as ICanvasViewBag } from "src/framework/interfaces/CanvasViewBag";
import { default as ICanvasViewBus } from "src/framework/interfaces/CanvasViewBus";

export default class CanvasViewBag implements ICanvasViewBag {
  readonly canvasViewBus: ICanvasViewBus;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly canvasViews: CanvasView[];

  constructor(canvasViewBus: ICanvasViewBus, loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.canvasViewBus = canvasViewBus;
    this.canvasViews = [];
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  add(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    this.canvasViews.push(canvasView);

    return this.canvasViewBus.add(cancelToken, canvasView);
  }

  async delete(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    while (this.canvasViews.includes(canvasView)) {
      for (let i = 0; i < this.canvasViews.length; i += 1) {
        if (this.canvasViews[i] === canvasView) {
          this.canvasViews.splice(i, 1);
          await this.canvasViewBus.delete(cancelToken, canvasView);
        }
      }
    }
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    for (let canvasView of this.canvasViews.slice().reverse()) {
      await this.delete(cancelToken, canvasView);
    }
  }

  fork(loggerBreadcrumbs: LoggerBreadcrumbs): ICanvasViewBag {
    return new CanvasViewBag(this.canvasViewBus, loggerBreadcrumbs);
  }
}
