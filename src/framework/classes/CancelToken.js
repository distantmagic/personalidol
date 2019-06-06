// @flow

import Cancelled from "./Exception/Cancelled";
import EventListenerSet from "./EventListenerSet";

import type { Cancelled as CancelledInterface } from "../interfaces/Exception/Cancelled";
import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { CancelTokenCallback } from "../types/CancelTokenCallback";
import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class CancelToken implements CancelTokenInterface {
  +abortController: AbortController;
  +callbacks: EventListenerSetInterface<[CancelledInterface]>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  _isCancelled: boolean;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this._isCancelled = false;
    this.abortController = new AbortController();
    this.callbacks = new EventListenerSet<[CancelledInterface]>();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  cancel(): void {
    this.abortController.abort();
    this._isCancelled = true;

    return this.callbacks.notify([new Cancelled(this.loggerBreadcrumbs, "Token is cancelled.")], true);
  }

  getAbortSignal(): AbortSignal {
    return this.abortController.signal;
  }

  isCancelled(): boolean {
    return this._isCancelled;
  }

  onCancelled(callback: CancelTokenCallback): void {
    if (this._isCancelled) {
      callback(new Cancelled(this.loggerBreadcrumbs, "Token is already cancelled."));
    } else {
      this.callbacks.add(callback);
    }
  }
}
