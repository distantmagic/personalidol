import { Cancelable } from "./Cancelable";
import { Canceled } from "../interfaces/Exception/Canceled";
import { CancelTokenCallback } from "../types/CancelTokenCallback";
import { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface CancelToken extends Cancelable {
  cancel(loggerBreadcrumbs: LoggerBreadcrumbs): void;

  getAbortSignal(): AbortSignal;

  onCanceled(cancelTokenCallback: CancelTokenCallback): void;

  settle(): void;

  whenCanceled(): Promise<Canceled>;
}
