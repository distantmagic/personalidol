// @flow

import type { Cancellable } from "./Cancellable";
import type { CancelTokenCallback } from "../types/CancelTokenCallback";
import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface CancelToken extends Cancellable {
  cancel(LoggerBreadcrumbs): void;

  getAbortSignal(): AbortSignal;

  onCancelled(CancelTokenCallback): void;
}
