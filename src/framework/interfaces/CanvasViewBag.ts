import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBus from "src/framework/interfaces/CanvasViewBus";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

export default interface CanvasViewBag extends CanvasViewBus {
  dispose(cancelToken: CancelToken): Promise<void>;

  fork(loggerBreadcrumbs: LoggerBreadcrumbs): CanvasViewBag;
}
