// @flow

import type { CancelTokenQuery } from "./CancelTokenQuery";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export interface QueryBatch {
  getCollection(): QueryBusQueueCollection<any>;

  getActive(): QueryBusQueueCollection<any>;

  getUnique(): QueryBusQueueCollection<any>;

  getSimilar<T>(CancelTokenQuery<T>): QueryBusQueueCollection<T>;

  infer<T>(CancelTokenQuery<T>): T;

  process(): Promise<void>;
}
