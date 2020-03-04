import Cancelable from "src/framework/interfaces/Cancelable";
import Canceled from "src/framework/interfaces/Exception/Canceled";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

import CancelTokenCallback from "src/framework/types/CancelTokenCallback";

export default interface CancelToken extends Cancelable {
  cancel(loggerBreadcrumbs: LoggerBreadcrumbs): void;

  getAbortSignal(): AbortSignal;

  onCanceled(cancelTokenCallback: CancelTokenCallback): void;

  // settle(): void;

  whenCanceled(): Promise<Canceled>;
}
