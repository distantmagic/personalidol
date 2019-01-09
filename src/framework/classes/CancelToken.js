// @flow

import EventEmitter from "eventemitter3";

import Cancelled from "./Exception/Cancelled";

import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";

export default class CancelToken implements CancelTokenInterface {
  _isCancelled: boolean;
  eventEmitter: EventEmitter;

  constructor() {
    this._isCancelled = false;
    this.eventEmitter = new EventEmitter();
  }

  cancel(): void {
    this._isCancelled = true;
    this.eventEmitter.emit("cancel", new Cancelled());
  }

  isCancelled(): boolean {
    return this._isCancelled;
  }

  onCancelled(): Promise<void> {
    return new Promise(resolve => {
      if (this._isCancelled) {
        resolve();
      } else {
        this.eventEmitter.once("cancel", resolve);
      }
    });
  }
}
