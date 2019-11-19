// @flow

import autoBind from "auto-bind";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasView } from "../interfaces/CanvasView";
import type { CanvasViewBag as CanvasViewBagInterface } from "../interfaces/CanvasViewBag";
import type { CanvasViewBus as CanvasViewBusInterface } from "../interfaces/CanvasViewBus";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class CanvasViewBag implements CanvasViewBagInterface {
  +canvasViewBus: CanvasViewBusInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +canvasViews: Set<CanvasView>;
  #isDisposed: boolean;

  constructor(canvasViewBus: CanvasViewBusInterface, loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.#isDisposed = false;
    this.canvasViewBus = canvasViewBus;
    this.canvasViews = new Set();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  add(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    this.canvasViews.add(canvasView);

    return this.canvasViewBus.add(cancelToken, canvasView);
  }

  delete(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    return this.canvasViewBus.delete(cancelToken, canvasView);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await Promise.all(
      Array.from(this.canvasViews).map((canvasView: CanvasView) => {
        return this.delete(cancelToken, canvasView);
      })
    );

    this.canvasViews.clear();
    this.#isDisposed = true;
  }

  isDisposed(): boolean {
    return this.#isDisposed;
  }

  fork(loggerBreadcrumbs: LoggerBreadcrumbs): CanvasViewBagInterface {
    return new CanvasViewBag(this.canvasViewBus, loggerBreadcrumbs);
  }
}
