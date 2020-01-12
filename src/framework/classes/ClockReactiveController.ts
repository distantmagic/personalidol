import { BusClock } from "../interfaces/BusClock";
import { CancelToken } from "../interfaces/CancelToken";
import { ClockReactive } from "../interfaces/ClockReactive";
import { ClockReactiveController as ClockReactiveControllerInterface } from "../interfaces/ClockReactiveController";

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
