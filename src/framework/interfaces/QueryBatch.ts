import { CancelTokenQuery } from "./CancelTokenQuery";
import { QueryBusQueueCollection } from "../types/QueryBusQueueCollection";

export interface QueryBatch {
  getCollection<T>(): QueryBusQueueCollection<T>;

  getActive<T>(): QueryBusQueueCollection<T>;

  getUnique<T>(): QueryBusQueueCollection<T>;

  getSimilar<T>(cancelTokenQuery: CancelTokenQuery<T>): QueryBusQueueCollection<T>;

  infer<T>(cancelTokenQuery: CancelTokenQuery<T>): T;

  process(): Promise<void>;
}
