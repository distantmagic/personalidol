// @flow

import Canceled from "./Exception/Canceled";
import EventListenerSet from "./EventListenerSet";
import Exception from "./Exception";

import type { Canceled as CanceledInterface } from "../interfaces/Exception/Canceled";
import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { CancelTokenCallback } from "../types/CancelTokenCallback";
import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class CancelToken implements CancelTokenInterface {
  +abortController: AbortController;
  +callbacks: EventListenerSetInterface<[CanceledInterface]>;
  +loggerBreadcrumbsCreate: LoggerBreadcrumbs;
  loggerBreadcrumbsCancel: ?LoggerBreadcrumbs;
  _isCanceled: boolean;

  constructor(loggerBreadcrumbsCreate: LoggerBreadcrumbs) {
    this._isCanceled = false;
    this.abortController = new AbortController();
    this.callbacks = new EventListenerSet<[CanceledInterface]>();
    this.loggerBreadcrumbsCancel = null;
    this.loggerBreadcrumbsCreate = loggerBreadcrumbsCreate;
  }

  cancel(loggerBreadcrumbsCancel: LoggerBreadcrumbs): void {
    this.loggerBreadcrumbsCancel = loggerBreadcrumbsCancel;
    this.abortController.abort();
    this._isCanceled = true;

    return this.callbacks.notify(
      [new Canceled(this.loggerBreadcrumbsCreate, `Token was canceled at: ${loggerBreadcrumbsCancel.asString()}`)],
      true
    );
  }

  getAbortSignal(): AbortSignal {
    return this.abortController.signal;
  }

  isCanceled(): boolean {
    return this._isCanceled;
  }

  onCanceled(callback: CancelTokenCallback): void {
    if (this._isCanceled) {
      const loggerBreadcrumbsCancel = this.loggerBreadcrumbsCancel;

      if (!loggerBreadcrumbsCancel) {
        throw new Exception(this.loggerBreadcrumbsCreate, "Unable to determine cancel token cancel location.");
      }

      callback(
        new Canceled(
          this.loggerBreadcrumbsCreate,
          `Token is already canceled at: ${loggerBreadcrumbsCancel.asString()}`
        )
      );
    } else {
      this.callbacks.add(callback);
    }
  }

  whenCanceled(): Promise<CanceledInterface> {
    return new Promise(resolve => this.onCanceled(resolve));
  }
}
