// @flow

import type { TimeoutTick as TimeoutTickInterface } from "../interfaces/TimeoutTick";

export default class TimeoutTick implements TimeoutTickInterface {
  canceled: boolean;

  constructor(canceled: boolean) {
    this.canceled = canceled;
  }

  isCanceled(): boolean {
    return this.canceled;
  }
}
