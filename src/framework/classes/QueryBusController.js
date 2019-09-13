// @flow

import type { BusClock } from "../interfaces/BusClock";
import type { CancelToken } from "../interfaces/CancelToken";
import type { QueryBus } from "../interfaces/QueryBus";
import type { QueryBusController as QueryBusControllerInterface } from "../interfaces/QueryBusController";

export default class QueryBusController implements QueryBusControllerInterface {
  clock: BusClock;
  queryBus: QueryBus;

  constructor(clock: BusClock, queryBus: QueryBus) {
    this.clock = clock;
    this.queryBus = queryBus;
  }

  async interval(cancelToken: CancelToken): Promise<void> {
    let tick;

    for await (tick of this.clock.interval(cancelToken)) {
      await this.queryBus.tick(tick);
    }
  }
}
