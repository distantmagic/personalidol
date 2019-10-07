// @flow

import type { BusClockTick as BusClockTickInterface } from "../interfaces/BusClockTick";
import type { ClockTick } from "../interfaces/ClockTick";

export default class BusClockTick implements BusClockTickInterface {
  tick: ClockTick;

  constructor(tick: ClockTick) {
    this.tick = tick;
  }

  isCanceled(): boolean {
    return this.tick.isCanceled();
  }
}
