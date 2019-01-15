// @flow

import type { ExpressionData } from "../types/ExpressionData";

export interface ExpressionContext {
  set(key: string, value: any): ExpressionContext;

  toObject(): ExpressionData;
}
