// @flow

import type { Expressible } from "./Expressible";
import type { Expression } from "./Expression";

export interface ExpressionBus {
  enqueue(Expression): Promise<string>;

  expressible(Expressible): Promise<?string>;
}
