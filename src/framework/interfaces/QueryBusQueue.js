// @flow

import type { CancelTokenQuery } from "./CancelTokenQuery";
import type { QueryBatch } from "./QueryBatch";
import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export interface QueryBusQueue {
  flush(): QueryBatch;

  push<T>(query: CancelTokenQuery<T>): void;
}
