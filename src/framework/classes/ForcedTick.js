// @flow

import type { ForcedTick as ForcedTickInterface } from "../interfaces/ForcedTick";

export default class ForcedTick implements ForcedTickInterface {
  cancelled: boolean;

  constructor(cancelled: boolean) {
    this.cancelled = cancelled;
  }

  isCancelled(): boolean {
    return this.cancelled;
  }
}
