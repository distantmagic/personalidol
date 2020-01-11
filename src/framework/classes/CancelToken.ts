import Canceled from "./Exception/CancelToken/Canceled";
import EventListenerSet from "./EventListenerSet";
import Exception from "./Exception";

import { Canceled as CanceledInterface } from "../interfaces/Exception/Canceled";
import { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import { CancelTokenCallback } from "../types/CancelTokenCallback";
import { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class CancelToken implements CancelTokenInterface {
  readonly abortController: AbortController;
  readonly callbacks: EventListenerSetInterface<[CanceledInterface]>;
  readonly loggerBreadcrumbsCreate: LoggerBreadcrumbs;
  loggerBreadcrumbsCancel: null | LoggerBreadcrumbs;
  _isCanceled: boolean;
  _isSettled: boolean;

  constructor(loggerBreadcrumbsCreate: LoggerBreadcrumbs) {
    this._isCanceled = false;
    this._isSettled = false;
    this.abortController = new AbortController();
    this.callbacks = new EventListenerSet<[CanceledInterface]>(loggerBreadcrumbsCreate);
    this.loggerBreadcrumbsCancel = null;
    this.loggerBreadcrumbsCreate = loggerBreadcrumbsCreate;
  }

  cancel(loggerBreadcrumbsCancel: LoggerBreadcrumbs): void {
    if (this._isSettled) {
      throw new Exception(this.loggerBreadcrumbsCreate, "Cancel token is settled and cannot be canceled.");
    }

    this.loggerBreadcrumbsCancel = loggerBreadcrumbsCancel;
    this.abortController.abort();
    this._isCanceled = true;

    this.callbacks.notify([new Canceled(this.loggerBreadcrumbsCreate, `Token was canceled at: ${loggerBreadcrumbsCancel.asString()}`)]);
    this.callbacks.clear();
  }

  getAbortSignal(): AbortSignal {
    return this.abortController.signal;
  }

  isCanceled(): boolean {
    return this._isCanceled;
  }

  onCanceled(callback: CancelTokenCallback): void {
    if (this._isSettled) {
      throw new Exception(this.loggerBreadcrumbsCreate, "Cancel token is settled and will never be canceled.");
    }
    if (this._isCanceled) {
      const loggerBreadcrumbsCancel = this.loggerBreadcrumbsCancel;

      if (!loggerBreadcrumbsCancel) {
        throw new Exception(this.loggerBreadcrumbsCreate, "Unable to determine cancel token cancel location.");
      }

      callback(new Canceled(this.loggerBreadcrumbsCreate, `Token is already canceled at: ${loggerBreadcrumbsCancel.asString()}`));
    } else {
      this.callbacks.add(callback);
    }
  }

  settle(): void {
    this._isSettled = true;
    this.callbacks.clear();
  }

  whenCanceled(): Promise<CanceledInterface> {
    return new Promise(resolve => this.onCanceled(resolve));
  }
}
