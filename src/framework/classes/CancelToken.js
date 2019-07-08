// @flow

import Cancelled from "./Exception/Cancelled";
import EventListenerSet from "./EventListenerSet";
import Exception from "./Exception";

import type { Cancelled as CancelledInterface } from "../interfaces/Exception/Cancelled";
import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { CancelTokenCallback } from "../types/CancelTokenCallback";
import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class CancelToken implements CancelTokenInterface {
  +abortController: AbortController;
  +callbacks: EventListenerSetInterface<[CancelledInterface]>;
  +loggerBreadcrumbsCreate: LoggerBreadcrumbs;
  loggerBreadcrumbsCancel: ?LoggerBreadcrumbs;
  _isCancelled: boolean;

  constructor(loggerBreadcrumbsCreate: LoggerBreadcrumbs) {
    this._isCancelled = false;
    this.abortController = new AbortController();
    this.callbacks = new EventListenerSet<[CancelledInterface]>();
    this.loggerBreadcrumbsCancel = null;
    this.loggerBreadcrumbsCreate = loggerBreadcrumbsCreate;
  }

  cancel(loggerBreadcrumbsCancel: LoggerBreadcrumbs): void {
    this.loggerBreadcrumbsCancel = loggerBreadcrumbsCancel;
    this.abortController.abort();
    this._isCancelled = true;

    return this.callbacks.notify(
      [new Cancelled(this.loggerBreadcrumbsCreate, `Token was cancelled at: ${loggerBreadcrumbsCancel.asString()}`)],
      true
    );
  }

  getAbortSignal(): AbortSignal {
    return this.abortController.signal;
  }

  isCancelled(): boolean {
    return this._isCancelled;
  }

  onCancelled(callback: CancelTokenCallback): void {
    if (this._isCancelled) {
      const loggerBreadcrumbsCancel = this.loggerBreadcrumbsCancel;

      if (!loggerBreadcrumbsCancel) {
        throw new Exception(this.loggerBreadcrumbsCreate, "Unable to determine cancel token cancel location.");
      }

      callback(
        new Cancelled(
          this.loggerBreadcrumbsCreate,
          `Token is already cancelled at: ${loggerBreadcrumbsCancel.asString()}`
        )
      );
    } else {
      this.callbacks.add(callback);
    }
  }
}
