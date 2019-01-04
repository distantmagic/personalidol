// @flow

import type { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export interface QueryBatch {
  process(): Promise<void>;
}
