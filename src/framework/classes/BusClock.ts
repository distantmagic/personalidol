import { BusClock as BusClockInterface } from "../interfaces/BusClock";
import { BusClockCallback } from "../types/BusClockCallback";
import { CancelToken } from "../interfaces/CancelToken";

export default class BusClock implements BusClockInterface {
  private delay: number;

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
      let timeoutId: null | ReturnType<typeof setTimeout> = null;

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
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          resolve();
        })
        .catch(reject);
    });
  }
}
