// @flow

import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export default class QueryBatch {
  collection: QueryBusQueueCollection;

  constructor(collection: QueryBusQueueCollection) {
    this.collection = collection;
  }

  async process(): Promise<void> {
    const active = this.collection.filter(query => !query.isCancelled());
    const unique = active.unique();

    const queries = unique.map(query => query.execute());

    await Promise.all(queries);
  }
}
