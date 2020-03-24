import AbortController from "abort-controller";

import Canceled from "src/framework/classes/Exception/CancelToken/Canceled";
import EventListenerSet from "src/framework/classes/EventListenerSet";
import Exception from "src/framework/classes/Exception";

import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as ICanceled } from "src/framework/interfaces/Exception/Canceled";
import type { default as ICancelToken } from "src/framework/interfaces/CancelToken";
import type { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";

import type CancelTokenCallback from "src/framework/types/CancelTokenCallback";

export default class CancelToken implements ICancelToken {
  private _isCanceled: boolean = false;
  private loggerBreadcrumbsCancel: null | LoggerBreadcrumbs = null;
  readonly abortController: AbortController = new AbortController();
  readonly callbacks: IEventListenerSet<[ICanceled]>;
  readonly loggerBreadcrumbsCreate: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbsCreate: LoggerBreadcrumbs) {
    this.callbacks = new EventListenerSet<[ICanceled]>(loggerBreadcrumbsCreate);
    this.loggerBreadcrumbsCreate = loggerBreadcrumbsCreate;
  }

  cancel(loggerBreadcrumbsCancel: LoggerBreadcrumbs): void {
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

  whenCanceled(): Promise<ICanceled> {
    return new Promise((resolve) => this.onCanceled(resolve));
  }
}
