// @flow

import Cancelled from "./Exception/Cancelled";

// import type { Cancelled as CancelledInterface } from "../interfaces/Exception/Cancelled";
import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { CancelTokenCallback } from "../types/CancelTokenCallback";

export default class CancelToken implements CancelTokenInterface {
  _isCancelled: boolean;
  +callbacks: Set<CancelTokenCallback>;

  constructor() {
    this._isCancelled = false;
    this.callbacks = new Set();
  }

  cancel(): void {
    this._isCancelled = true;

    for (let [callback] of this.callbacks.entries()) {
      callback(new Cancelled("Token is cancelled."));
    }
    this.callbacks.clear();
  }

  isCancelled(): boolean {
    return this._isCancelled;
  }

  onCancelled(callback: CancelTokenCallback): void {
    // console.log('onCancelled');
    if (this._isCancelled) {
      callback(new Cancelled("Token is already cancelled."));
    } else {
      this.callbacks.add(callback);
    }
  }
}
