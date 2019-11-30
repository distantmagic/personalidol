// @flow

import type { CancelTokenQuery } from "../interfaces/CancelTokenQuery";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

function checkIsQueryMergeable<T>(element: CancelTokenQuery<T>): (CancelTokenQuery<T>) => boolean {
  return function(other: CancelTokenQuery<any>) {
    return isCancelTokenQueryMergeable(element, other);
  };
}

function includesSimilar(collection: QueryBusQueueCollection<any>, other: CancelTokenQuery<any>): boolean {
  return collection.some(checkIsQueryMergeable(other));
}

function isCancelTokenQueryMergeable(a: CancelTokenQuery<any>, b: CancelTokenQuery<any>): boolean {
  if (a === b) {
    return false;
  }

  const aQuery = a.getQuery();
  const bQuery = b.getQuery();

  if (aQuery.constructor !== bQuery.constructor || aQuery === bQuery) {
    return false;
  }

  return a.isEqual(b);
}

export default class QueryBatch {
  +collection: QueryBusQueueCollection<any>;

  constructor(collection: QueryBusQueueCollection<any>) {
    this.collection = collection;
  }

  getActive(): QueryBusQueueCollection<any> {
    return this.getCollection().filter(query => !query.isCanceled());
  }

  getCollection(): QueryBusQueueCollection<any> {
    return this.collection;
  }

  getSimilar<T>(cancelTokenQuery: CancelTokenQuery<T>): QueryBusQueueCollection<T> {
    return this.getActive().filter(checkIsQueryMergeable(cancelTokenQuery));
  }

  getUnique(): QueryBusQueueCollection<any> {
    const unique: CancelTokenQuery<any>[] = [];

    for (let cancelTokenQuery of this.getActive()) {
      if (!includesSimilar(unique, cancelTokenQuery)) {
        unique.push(cancelTokenQuery);
      }
    }

    return unique;
  }

  infer<T>(cancelTokenQuery: CancelTokenQuery<T>): T {
    for (let similarQuery of this.getSimilar(cancelTokenQuery)) {
      similarQuery.infer(cancelTokenQuery);
    }

    return cancelTokenQuery.getResult();
  }

  async process(): Promise<void> {
    const unique = this.getUnique();

    const executions = unique.map(query => {
      return query.execute().then(() => this.infer(query));
    });

    await Promise.all(executions);
  }
}
