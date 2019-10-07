// @flow

import type { IntervalTick as IntervalTickInterface } from "../interfaces/IntervalTick";
import type { TimeoutTick } from "../interfaces/TimeoutTick";

export default class IntervalTick implements IntervalTickInterface {
  timeoutTick: TimeoutTick;

  constructor(timeoutTick: TimeoutTick) {
    this.timeoutTick = timeoutTick;
  }

  isCanceled(): boolean {
    return this.timeoutTick.isCanceled();
  }
}
