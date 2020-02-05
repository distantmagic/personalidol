import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import { default as IBusClock } from "src/framework/interfaces/BusClock";

import BusClockCallback from "src/framework/types/BusClockCallback";

export default class BusClock implements IBusClock {
  private delay: number;

  constructor(delay: number = 40) {
    this.delay = delay;
  }

  @cancelable()
  async interval(cancelToken: CancelToken, callback: BusClockCallback): Promise<void> {
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
