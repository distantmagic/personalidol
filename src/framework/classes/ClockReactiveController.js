// @flow

import type { BusClock } from "../interfaces/BusClock";
import type { CancelToken } from "../interfaces/CancelToken";
import type { ClockReactive } from "../interfaces/ClockReactive";
import type { ClockReactiveController as ClockReactiveControllerInterface } from "../interfaces/ClockReactiveController";

export default class ClockReactiveController implements ClockReactiveControllerInterface {
  clock: BusClock;
  clockReactives: $ReadOnlyArray<ClockReactive>;

  constructor(clock: BusClock, clockReactives: $ReadOnlyArray<ClockReactive>) {
    this.clock = clock;
    this.clockReactives = clockReactives;
  }

  async interval(cancelToken: CancelToken): Promise<void> {
    let tick;

    for await (tick of this.clock.interval(cancelToken)) {
      if (cancelToken.isCanceled()) {
        return;
      }

      // keep loop variable reference safe
      const thisTick = tick;

      // process all scheduled ticks simultaneously
      const scheduledTicks = this.clockReactives.map(clockReactive => {
        return clockReactive.tick(thisTick);
      });

      await Promise.all(scheduledTicks);
    }
  }
}
