// @flow

import type { ExpressionGlobalContext as ExpressionGlobalContextInterface } from "../interfaces/ExpressionGlobalContext";
import type { QueryBus } from "../interfaces/QueryBus";

export default class ExpressionGlobalContext
  implements ExpressionGlobalContextInterface {
  queryBus: QueryBus;

  constructor(queryBus: QueryBus) {
    this.queryBus = queryBus;
  }
}
