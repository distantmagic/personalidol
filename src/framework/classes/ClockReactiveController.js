// @flow

import type { BusClock } from "../interfaces/BusClock";
import type { CancelToken } from "../interfaces/CancelToken";
import type { ClockReactive } from "../interfaces/ClockReactive";
import type { ClockReactiveController as ClockReactiveControllerInterface } from "../interfaces/ClockReactiveController";

export default class ClockReactiveController implements ClockReactiveControllerInterface {
  clock: BusClock;
  clockReactive: ClockReactive;

  constructor(clock: BusClock, clockReactive: ClockReactive) {
    this.clock = clock;
    this.clockReactive = clockReactive;
  }

  async interval(cancelToken: CancelToken): Promise<void> {
    let tick;

    for await (tick of this.clock.interval(cancelToken)) {
      if (cancelToken.isCanceled()) {
        return;
      }

      await this.clockReactive.tick(tick);
    }
  }
}
