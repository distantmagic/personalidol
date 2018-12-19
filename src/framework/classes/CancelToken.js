// @flow

import EventEmitter from "eventemitter3";

import Cancelled from "./Exception/Cancelled";

import type {
  CancelToken as CancelTokenInterface,
  OnCancelCallback
} from "../interfaces/CancelToken";

export default class CancelToken implements CancelTokenInterface {
  _isCancelled: boolean;
  eventEmitter: EventEmitter;

  constructor() {
    this._isCancelled = false;
    this.eventEmitter = new EventEmitter();
  }

  isCancelled(): boolean {
    return this._isCancelled;
  }

  cancel(): void {
    this._isCancelled = true;
    this.eventEmitter.emit("cancel", new Cancelled());
  }

  onCancel(callback: OnCancelCallback): void {
    this.eventEmitter.once("cancel", callback);
  }
}
