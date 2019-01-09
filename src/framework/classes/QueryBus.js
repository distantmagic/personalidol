// @flow

import CancelTokenQuery from "./CancelTokenQuery";
import Collection from "./Collection";
import QueryBatch from "./QueryBatch";

import type { CancelToken } from "../interfaces/CancelToken";
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

    this.collection = new Collection();

    return queryBatch;
  }

  pickQuery<T>(other: Query<T>): Query<T> {
    return this.findSimilarQuery(other) || other;
  }

  tick(): Promise<void> {
    return this.flush().process();
  }
}
