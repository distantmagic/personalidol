// @flow

import CancelTokenQuery from "./CancelTokenQuery";
import QueryBusQueue from "./QueryBusQueue";

import type { CancelToken } from "../interfaces/CancelToken";
import type { Query } from "../interfaces/Query";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";

export default class QueryBus implements QueryBusInterface {
  queryBusQueue: QueryBusQueue;

  constructor() {
    this.queryBusQueue = new QueryBusQueue();
  }

  enqueue<T>(cancelToken: CancelToken, query: Query<T>): Promise<T> {
    const cancelTokenQuery = new CancelTokenQuery(cancelToken, query);

    this.queryBusQueue.push(cancelTokenQuery);

    return cancelTokenQuery.onExecuted();
  }

  process(): Promise<void> {
    return this.queryBusQueue.flush().process();
  }
}
