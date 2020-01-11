// @flow strict

import autoBind from "auto-bind";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasView } from "../interfaces/CanvasView";
import type { CanvasViewBag as CanvasViewBagInterface } from "../interfaces/CanvasViewBag";
import type { CanvasViewBus as CanvasViewBusInterface } from "../interfaces/CanvasViewBus";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class CanvasViewBag implements CanvasViewBagInterface {
  +canvasViewBus: CanvasViewBusInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +canvasViews: CanvasView[];

  constructor(canvasViewBus: CanvasViewBusInterface, loggerBreadcrumbs: LoggerBreadcrumbs) {
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

  fork(loggerBreadcrumbs: LoggerBreadcrumbs): CanvasViewBagInterface {
    return new CanvasViewBag(this.canvasViewBus, loggerBreadcrumbs);
  }
}
