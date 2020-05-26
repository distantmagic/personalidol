import autoBind from "auto-bind";
import isEmpty from "lodash/isEmpty";

import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasView from "src/framework/interfaces/CanvasView";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as ICanvasViewBag } from "src/framework/interfaces/CanvasViewBag";
import type { default as ICanvasViewBus } from "src/framework/interfaces/CanvasViewBus";

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
    while (!isEmpty(this.canvasViews)) {
      const canvasView = this.canvasViews.pop();

      if (canvasView) {
        await this.delete(cancelToken, canvasView);
      } else {
        return;
      }
    }
  }

  fork(loggerBreadcrumbs: LoggerBreadcrumbs): ICanvasViewBag {
    return new CanvasViewBag(loggerBreadcrumbs, this.canvasViewBus);
  }
}
