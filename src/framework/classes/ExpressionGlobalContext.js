// @flow

import type { QueryBus } from "../interfaces/QueryBus";

export default class ExpressionGlobalContext {
  queryBus: QueryBus;

  constructor(queryBus: QueryBus) {
    this.queryBus = queryBus;
  }
}
