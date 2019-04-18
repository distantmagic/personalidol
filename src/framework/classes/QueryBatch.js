// @flow

import type { CancelTokenQuery } from "../interfaces/CancelTokenQuery";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

function findActive(
  collection: QueryBusQueueCollection
): QueryBusQueueCollection {
  return collection.filter(function(query) {
    return !query.isCancelled();
  });
}

function findSimilar(
  collection: QueryBusQueueCollection,
  other: CancelTokenQuery<any>
): QueryBusQueueCollection {
  return collection.filter(function(element) {
    return element.isEqual(other) && element !== other;
  });
}

function findUnique(
  collection: QueryBusQueueCollection
): QueryBusQueueCollection {
  return collection.reduce(function(acc: QueryBusQueueCollection, item) {
    if (!includesSimilar(acc, item)) {
      acc.push(item);
    }

    return acc;
  }, []);
}

function includesSimilar(
  collection: QueryBusQueueCollection,
  other: CancelTokenQuery<any>
): boolean {
  return collection.some(function(element) {
    return element.isEqual(other);
  });
}

function infer(
  allQueries: QueryBusQueueCollection,
  executedQueries: QueryBusQueueCollection
): void {
  for (let cancelTokenQuery of executedQueries) {
    const similarQueries = findSimilar(
      findActive(allQueries),
      cancelTokenQuery
    );
    for (let similarQuery of similarQueries) {
      similarQuery.setExecuted(cancelTokenQuery.getResult());
    }
  }
}

export default class QueryBatch {
  +collection: QueryBusQueueCollection;

  constructor(collection: QueryBusQueueCollection) {
    this.collection = collection;
  }

  async process(): Promise<void> {
    const unique = findUnique(findActive(this.collection));
    const executions = unique.map(function(query) {
      return query.execute();
    });

    await Promise.all(executions);

    return infer(this.collection, unique);
  }
}
