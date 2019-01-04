// @flow

import Collection from "./Collection";
import QueryBatch from "./QueryBatch";

import type { CancelTokenQuery } from "../interfaces/CancelTokenQuery";
import type { QueryBatch as QueryBatchInterface } from "../interfaces/QueryBatch";
import type { QueryBusQueue as QueryBusQueueInterface } from "../interfaces/QueryBusQueue";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export default class QueryBusQueue implements QueryBusQueueInterface {
  collection: QueryBusQueueCollection;

  constructor(collection?: QueryBusQueueCollection) {
    this.collection = collection || new Collection();
  }

  flush(): QueryBatchInterface {
    const queryBatch = new QueryBatch(this.collection);

    this.collection = new Collection();

    return queryBatch;
  }

  push<T>(query: CancelTokenQuery<T>): void {
    this.collection = this.collection.add(query);
  }
}
