// @flow

import type { BusClock as BusClockInterface } from "../interfaces/BusClock";
import type { BusClockCallback } from "../types/BusClockCallback";
import type { CancelToken } from "../interfaces/CancelToken";

export default class BusClock implements BusClockInterface {
  delay: number;

  constructor(delay: number = 600) {
    this.delay = delay;
  }

  async interval(cancelToken: CancelToken, callback: BusClockCallback): Promise<void> {
    return new Promise((resolve, reject) => {
      const tick = () => {
        if (cancelToken.isCanceled()) {
          resolve();
        } else {
          callback();
          setTimeout(tick, this.delay);
        }
      };

      setTimeout(tick, this.delay);
    });
  }
}
