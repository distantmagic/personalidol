// @flow strict

import Condition from "./Condition";
import Expression from "./Expression";

import type { Expression as ExpressionInterface } from "../interfaces/Expression";
import type { ExpressionContext } from "../interfaces/ExpressionContext";
import type { ExpressionBus as ExpressionBusInterface } from "../interfaces/ExpressionBus";
// import type { QueryBus } from "../interfaces/QueryBus";

/**
 * Expression can be both query, command or an entire script to be executed.
 * Thus expressions themselves cannot be put on query bus, but instead query
 * bus can be used to execute queries produced by expressions.
 */
export default class ExpressionBus implements ExpressionBusInterface {
  enqueue(expression: ExpressionInterface): Promise<string> {
    return expression.execute();
  }

  async condition(expression: ExpressionInterface): Promise<boolean> {
    const result = await this.enqueue(expression);
    const condition = new Condition(result);

    return condition.interpret();
  }

  expression(expression: string, context: ExpressionContext): Promise<string> {
    return this.enqueue(new Expression(expression, context));
  }
}
