// @flow

import type { Cancelable } from "./Cancelable";
import type { CancelTokenCallback } from "../types/CancelTokenCallback";
import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface CancelToken extends Cancelable {
  cancel(LoggerBreadcrumbs): void;

  getAbortSignal(): AbortSignal;

  onCanceled(CancelTokenCallback): void;
}
