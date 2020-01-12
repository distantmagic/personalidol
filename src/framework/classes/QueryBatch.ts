import autoBind from "auto-bind";

import { CancelTokenQuery } from "src/framework/interfaces/CancelTokenQuery";
import { ExceptionHandler } from "src/framework/interfaces/ExceptionHandler";
import { QueryBatch as QueryBatchInterface } from "src/framework/interfaces/QueryBatch";
import { QueryBusQueueCollection } from "src/framework/types/QueryBusQueueCollection";

function checkIsQueryInferable<T>(element: CancelTokenQuery<T>): (cancelTokenQuery: CancelTokenQuery<T>) => boolean {
  return function(other: CancelTokenQuery<any>) {
    return element.isInferableFrom(other);
  };
}

function includesInferable(collection: QueryBusQueueCollection<any>, other: CancelTokenQuery<any>): boolean {
  return collection.some(checkIsQueryInferable(other));
}

export default class QueryBatch implements QueryBatchInterface {
  readonly collection: QueryBusQueueCollection<any>;
  readonly exceptionHandler: ExceptionHandler;

  constructor(exceptionHandler: ExceptionHandler, collection: QueryBusQueueCollection<any>) {
    autoBind(this);

    this.collection = collection;
    this.exceptionHandler = exceptionHandler;
  }

  async executeQuery<T>(query: CancelTokenQuery<T>): Promise<T> {
    await query.execute();

    return this.infer(query);
  }

  getActive<T>(): QueryBusQueueCollection<T> {
    return this.getCollection<T>().filter(query => !query.isCanceled());
  }

  getCollection<T>(): QueryBusQueueCollection<T> {
    return this.collection;
  }

  getSimilar<T>(cancelTokenQuery: CancelTokenQuery<T>): QueryBusQueueCollection<T> {
    return this.getActive<T>().filter(checkIsQueryInferable(cancelTokenQuery));
  }

  getUnique<T>(): QueryBusQueueCollection<T> {
    const unique: CancelTokenQuery<T>[] = [];

    for (let cancelTokenQuery of this.getActive<T>()) {
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
