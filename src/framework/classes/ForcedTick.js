// @flow

import type { ForcedTick as ForcedTickInterface } from "../interfaces/ForcedTick";

export default class ForcedTick implements ForcedTickInterface {
  canceled: boolean;

  constructor(canceled: boolean) {
    this.canceled = canceled;
  }

  isCanceled(): boolean {
    return this.canceled;
  }
}
