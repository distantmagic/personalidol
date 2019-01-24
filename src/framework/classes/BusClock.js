// @flow

import BusClockTick from "./BusClockTick";
import interval from "../helpers/interval";

import type { CancelToken } from "../interfaces/CancelToken";
import type { BusClock as BusClockInterface } from "../interfaces/BusClock";
import type { BusClockTick as BusClockTickInterface } from "../interfaces/BusClockTick";

export default class BusClock implements BusClockInterface {
  delay: number;

  constructor(delay: number = 1000) {
    this.delay = delay;
  }

  async *interval(
    cancelToken: CancelToken
  ): AsyncGenerator<BusClockTickInterface, void, void> {
    for await (let tick of interval(this.delay, cancelToken)) {
      yield new BusClockTick();
    }
  }
}
