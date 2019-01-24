// @flow

import CancelTokenQuery from "./CancelTokenQuery";
import Collection from "./Collection";
import QueryBatch from "./QueryBatch";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ClockTick } from "../interfaces/ClockTick";
import type { Query } from "../interfaces/Query";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export default class QueryBus implements QueryBusInterface {
  collection: QueryBusQueueCollection;

  constructor() {
    this.collection = new Collection();
  }

  enqueue<T>(cancelToken: CancelToken, query: Query<T>): Promise<T> {
    const pickedQuery = this.pickQuery(query);
    const cancelTokenQuery = new CancelTokenQuery(cancelToken, pickedQuery);

    this.collection = this.collection.add(cancelTokenQuery);

    return cancelTokenQuery.onExecuted();
  }

  findSimilarQuery<T>(other: Query<T>): ?Query<T> {
    const found = this.collection.find(cancelTokenQuery =>
      cancelTokenQuery.getQuery().isEqual(other)
    );

    return found ? found.getQuery() : null;
  }

  flush(): QueryBatch {
    const queryBatch = new QueryBatch(this.collection);

    this.collection = this.collection.clear();

    return queryBatch;
  }

  pickQuery<T>(other: Query<T>): Query<T> {
    return this.findSimilarQuery(other) || other;
  }

  async tick(tick: ClockTick): Promise<QueryBusInterface> {
    // Random things happen, timeouts and intervals are not reliable (those are
    // definitely not real time clocks) and QueryBus is really important to
    // the system.
    // It's better to have this additional check here, just for safety.
    if (tick.isCancelled()) {
      return this;
    }

    await this.flush().process();

    return this;
  }
}
