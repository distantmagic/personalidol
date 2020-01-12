import { Cancelable } from "src/framework/interfaces/Cancelable";
import { Canceled } from "src/framework/interfaces/Exception/Canceled";
import { CancelTokenCallback } from "src/framework/types/CancelTokenCallback";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";

export interface CancelToken extends Cancelable {
  cancel(loggerBreadcrumbs: LoggerBreadcrumbs): void;

  getAbortSignal(): AbortSignal;

  onCanceled(cancelTokenCallback: CancelTokenCallback): void;

  settle(): void;

  whenCanceled(): Promise<Canceled>;
}
