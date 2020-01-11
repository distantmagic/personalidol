// @flow strict

import type { CancelTokenQuery } from "./CancelTokenQuery";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export interface QueryBatch {
  getCollection<T>(): QueryBusQueueCollection<T>;

  getActive<T>(): QueryBusQueueCollection<T>;

  getUnique<T>(): QueryBusQueueCollection<T>;

  getSimilar<T>(CancelTokenQuery<T>): QueryBusQueueCollection<T>;

  infer<T>(CancelTokenQuery<T>): T;

  process(): Promise<void>;
}
