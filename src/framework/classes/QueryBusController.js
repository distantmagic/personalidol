// @flow

import type { BusClock } from "../interfaces/BusClock";
import type { CancelToken } from "../interfaces/CancelToken";
import type { QueryBus } from "../interfaces/QueryBus";

export default class QueryBusController {
  clock: BusClock;
  queryBus: QueryBus;

  constructor(clock: BusClock, queryBus: QueryBus) {
    this.clock = clock;
    this.queryBus = queryBus;
  }

  async interval(cancelToken: CancelToken): Promise<void> {
    for await (let tick of this.clock.interval(cancelToken)) {
      this.queryBus.tick();
    }
  }
}
