// @flow

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
    this.#isDisposed = false;
    this.canvasViewBus = canvasViewBus;
    this.canvasViews = new Set();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  add(canvasView: CanvasView): void {
    this.canvasViewBus.add(canvasView);
    this.canvasViews.add(canvasView);
  }

  delete(canvasView: CanvasView): void {
    this.canvasViewBus.delete(canvasView);
  }

  dispose(): void {
    for (let canvasView of this.canvasViews) {
      canvasView.dispose();
    }

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
