// @flow

import type { TimeoutTick as TimeoutTickInterface } from "../interfaces/TimeoutTick";

export default class TimeoutTick implements TimeoutTickInterface {
  cancelled: boolean;

  constructor(cancelled: boolean) {
    this.cancelled = cancelled;
  }

  isCancelled(): boolean {
    return this.cancelled;
  }
}
