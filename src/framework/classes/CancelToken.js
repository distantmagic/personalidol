// @flow

import Cancelled from "./Exception/Cancelled";

// import type { Cancelled as CancelledInterface } from "../interfaces/Exception/Cancelled";
import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { CancelTokenCallback } from "../types/CancelTokenCallback";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class CancelToken implements CancelTokenInterface {
  +abortController: AbortController;
  +callbacks: Set<CancelTokenCallback>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  _isCancelled: boolean;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this._isCancelled = false;
    this.abortController = new AbortController();
    this.callbacks = new Set();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  cancel(): void {
    this.abortController.abort();
    this._isCancelled = true;

    for (let callback of this.callbacks.values()) {
      callback(new Cancelled(this.loggerBreadcrumbs, "Token is cancelled."));
    }

    this.callbacks.clear();
  }

  getAbortSignal(): AbortSignal {
    return this.abortController.signal;
  }

  isCancelled(): boolean {
    return this._isCancelled;
  }

  onCancelled(callback: CancelTokenCallback): void {
    if (this._isCancelled) {
      callback(
        new Cancelled(this.loggerBreadcrumbs, "Token is already cancelled.")
      );
    } else {
      this.callbacks.add(callback);
    }
  }
}
