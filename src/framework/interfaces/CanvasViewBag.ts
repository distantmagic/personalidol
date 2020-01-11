// @flow strict

import type { CancelToken } from "./CancelToken";
import type { CanvasViewBus } from "./CanvasViewBus";
import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface CanvasViewBag extends CanvasViewBus {
  dispose(CancelToken): Promise<void>;

  fork(LoggerBreadcrumbs): CanvasViewBag;
}
