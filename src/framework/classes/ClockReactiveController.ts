import { BusClock } from "src/framework/interfaces/BusClock";
import { CancelToken } from "src/framework/interfaces/CancelToken";
import { ClockReactive } from "src/framework/interfaces/ClockReactive";
import { ClockReactiveController as ClockReactiveControllerInterface } from "src/framework/interfaces/ClockReactiveController";

export default class ClockReactiveController implements ClockReactiveControllerInterface {
  readonly clock: BusClock;
  readonly clockReactive: ClockReactive;

  constructor(clock: BusClock, clockReactive: ClockReactive) {
    this.clock = clock;
    this.clockReactive = clockReactive;
  }

  interval(cancelToken: CancelToken): Promise<void> {
    return this.clock.interval(cancelToken, this.clockReactive.tick);
  }
}
