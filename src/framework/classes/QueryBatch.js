// @flow

// import type { CancelTokenQuery } from "../interfaces/CancelTokenQuery";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export default class QueryBatch {
  collection: QueryBusQueueCollection;

  constructor(collection: QueryBusQueueCollection) {
    this.collection = collection;
  }

  getActive(): QueryBusQueueCollection {
    return this.collection.filter(query => !query.isCancelled());
  }

  infer(collection: QueryBusQueueCollection): void {
    collection.forEach(cancelTokenQuery => {
      this.getActive()
        .similar(cancelTokenQuery)
        .forEach(activeQuery => {
          activeQuery.setExecuted(cancelTokenQuery.getResult());
        });
    });
  }

  async process(): Promise<void> {
    const unique = this.getActive().unique();
    const executions = unique.map(query => query.execute());

    await Promise.all(executions);

    this.infer(unique);
  }
}
