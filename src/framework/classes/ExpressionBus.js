// @flow

import type { Expressible } from "../interfaces/Expressible";
import type { Expression } from "../interfaces/Expression";
import type { ExpressionBus as ExpressionBusInterface } from "../interfaces/ExpressionBus";
import type { QueryBus } from "../interfaces/QueryBus";

/**
 * Expression can be both query, command or an entire script to be executed.
 * Thus expressions themselves cannot be put on query bus, but instead query
 * bus can be used to execute queries produced by expressions.
 */
export default class ExpressionBus implements ExpressionBusInterface {
  queryBus: QueryBus;

  constructor(queryBus: QueryBus) {
    this.queryBus = queryBus;
  }

  enqueue(expression: Expression): Promise<string> {
    return expression.execute();
  }

  async expressible(expressible: Expressible): Promise<null | string> {
    const expression = expressible.expression();

    if (!expression) {
      return null;
    }

    return this.enqueue(expression);
  }
}
