// @flow

import type { BusClock as BusClockInterface } from "../interfaces/BusClock";
import type { BusClockCallback } from "../types/BusClockCallback";
import type { CancelToken } from "../interfaces/CancelToken";

export default class BusClock implements BusClockInterface {
  delay: number;

  static createForMainThread(): BusClockInterface {
    return new BusClock(400);
  }

  static createForWorkerThread(): BusClockInterface {
    return new BusClock(200);
  }

  constructor(delay: number = 400) {
    this.delay = delay;
  }

  async interval(cancelToken: CancelToken, callback: BusClockCallback): Promise<void> {
    if (cancelToken.isCanceled()) {
      // nothing to do here
      return;
    }

    return new Promise((resolve, reject) => {
      let timeoutId;
      const tick = () => {
        if (cancelToken.isCanceled()) {
          resolve();
        } else {
          callback();
          timeoutId = setTimeout(tick, this.delay);
        }
      };

      timeoutId = setTimeout(tick, this.delay);
      cancelToken
        .whenCanceled()
        .then(function() {
          clearTimeout(timeoutId);
          resolve();
        })
        .catch(reject);
    });
  }
}
