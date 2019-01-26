// @flow

import EventEmitter from "eventemitter3";

import Cancelled from "./Exception/Cancelled";

// import type { Cancelled as CancelledInterface } from "../interfaces/Exception/Cancelled";
import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { CancelTokenCallback } from "../types/CancelTokenCallback";

export default class CancelToken implements CancelTokenInterface {
  _isCancelled: boolean;
  +eventEmitter: EventEmitter;

  constructor() {
    this._isCancelled = false;
    this.eventEmitter = new EventEmitter();
  }

  cancel(): void {
    this._isCancelled = true;
    this.eventEmitter.emit("cancel");
  }

  isCancelled(): boolean {
    return this._isCancelled;
  }

  onCancelled(callback: CancelTokenCallback): void {
    if (this._isCancelled) {
      callback(new Cancelled("Token was already cancelled."));
    } else {
      this.eventEmitter.once("cancel", function() {
        callback(new Cancelled("Token was cancelled."));
      });
    }
  }
}
