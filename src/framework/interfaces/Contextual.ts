// @flow strict

import type { ExpressionContext } from "./ExpressionContext";

export interface Contextual {
  getExpressionContext(): ExpressionContext;
}
