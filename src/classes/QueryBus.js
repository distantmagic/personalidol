// @flow

import Query from './Query';
import QueryBuffer from './QueryBuffer';
import QueryObserver from './QueryObserver';

export default class QueryBus {
  queryBuffer: QueryBuffer;

  constructor(queryBuffer: QueryBuffer) {
    this.queryBuffer = queryBuffer;
  }

  source<T>(query: Query<T>): Promise<T> {
    const queryObserver = new QueryObserver<T>(query);

    this.queryBuffer.add(queryObserver);

    return queryObserver.await();
  }
}
