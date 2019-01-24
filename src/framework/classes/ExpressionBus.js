// @flow

import Condition from "./Condition";

import type { Expression } from "../interfaces/Expression";
import type { ExpressionBus as ExpressionBusInterface } from "../interfaces/ExpressionBus";
// import type { QueryBus } from "../interfaces/QueryBus";

/**
 * Expression can be both query, command or an entire script to be executed.
 * Thus expressions themselves cannot be put on query bus, but instead query
 * bus can be used to execute queries produced by expressions.
 */
export default class ExpressionBus implements ExpressionBusInterface {
  enqueue(expression: Expression): Promise<string> {
    return expression.execute();
  }

  async condition(expression: Expression): Promise<boolean> {
    const result = await this.enqueue(expression);
    const condition = new Condition(result);

    return condition.interpret();
  }
}
