// @flow

import EventEmitter from "eventemitter3";

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
      callback();
    } else {
      this.eventEmitter.once("cancel", callback);
    }
  }
}
