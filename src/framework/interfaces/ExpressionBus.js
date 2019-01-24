// @flow

import type { Expressible } from "./Expressible";
import type { Expression } from "./Expression";

export interface ExpressionBus {
  condition(Expression): Promise<boolean>;

  enqueue(Expression): Promise<string>;

  expressible(Expressible): Promise<?string>;
}
