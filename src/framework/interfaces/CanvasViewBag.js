// @flow

import type { CanvasViewBus } from "./CanvasViewBus";
import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface CanvasViewBag extends CanvasViewBus {
  dispose(): void;

  isDisposed(): boolean;

  fork(LoggerBreadcrumbs): CanvasViewBag;
}
