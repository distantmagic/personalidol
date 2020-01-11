import { CancelToken } from "./CancelToken";
import { CanvasViewBus } from "./CanvasViewBus";
import { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface CanvasViewBag extends CanvasViewBus {
  dispose(cancelToken: CancelToken): Promise<void>;

  fork(loggerBreadcrumbs: LoggerBreadcrumbs): CanvasViewBag;
}
