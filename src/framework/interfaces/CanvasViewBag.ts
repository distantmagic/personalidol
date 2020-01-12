import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasViewBus } from "src/framework/interfaces/CanvasViewBus";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";

export interface CanvasViewBag extends CanvasViewBus {
  dispose(cancelToken: CancelToken): Promise<void>;

  fork(loggerBreadcrumbs: LoggerBreadcrumbs): CanvasViewBag;
}
