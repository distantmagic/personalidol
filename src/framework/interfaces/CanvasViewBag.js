// @flow

import type { CancelToken } from "./CancelToken";
import type { CanvasViewBus } from "./CanvasViewBus";
import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface CanvasViewBag extends CanvasViewBus {
  dispose(CancelToken): Promise<void>;

  isDisposed(): boolean;

  fork(LoggerBreadcrumbs): CanvasViewBag;
}
