// @flow strict

import autoBind from "auto-bind";

import type { CancelTokenQuery } from "../interfaces/CancelTokenQuery";
import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { QueryBatch as QueryBatchInterface } from "../interfaces/QueryBatch";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

function checkIsQueryInferable<T>(element: CancelTokenQuery<T>): (CancelTokenQuery<T>) => boolean {
  return function(other: CancelTokenQuery<any>) {
    return element.isInferableFrom(other);
  };
}

function includesInferable(collection: QueryBusQueueCollection<any>, other: CancelTokenQuery<any>): boolean {
  return collection.some(checkIsQueryInferable(other));
}

export default class QueryBatch implements QueryBatchInterface {
  +collection: QueryBusQueueCollection<any>;
  +exceptionHandler: ExceptionHandler;

  constructor(exceptionHandler: ExceptionHandler, collection: QueryBusQueueCollection<any>) {
    autoBind(this);

    this.collection = collection;
  }

  async executeQuery<T>(query: CancelTokenQuery<T>): Promise<T> {
    await query.execute();

    return this.infer(query);
  }

  getActive<T>(): QueryBusQueueCollection<T> {
    return this.getCollection().filter(query => !query.isCanceled());
  }

  getCollection<T>(): QueryBusQueueCollection<T> {
    return this.collection;
  }

  getSimilar<T>(cancelTokenQuery: CancelTokenQuery<T>): QueryBusQueueCollection<T> {
    return this.getActive().filter(checkIsQueryInferable(cancelTokenQuery));
  }

  getUnique<T>(): QueryBusQueueCollection<T> {
    const unique: CancelTokenQuery<T>[] = [];

    for (let cancelTokenQuery of this.getActive()) {
      if (!includesInferable(unique, cancelTokenQuery)) {
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

    const executions = unique.map(this.executeQuery);

    await Promise.all(executions);
  }
}
