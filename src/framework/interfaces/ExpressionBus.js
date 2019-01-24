// @flow

import type { Expression } from "./Expression";

export interface ExpressionBus {
  condition(Expression): Promise<boolean>;

  enqueue(Expression): Promise<string>;
}
