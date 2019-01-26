// @flow

import type { Expression } from "./Expression";
import type { ExpressionContext } from "./ExpressionContext";

export interface ExpressionBus {
  condition(Expression): Promise<boolean>;

  enqueue(Expression): Promise<string>;

  expression(string, ExpressionContext): Promise<string>;
}
