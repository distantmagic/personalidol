// @flow

import type { ExpressionData } from "../types/ExpressionData";

export interface ExpressionCaster<T> {
  cast(expression: string, data: ExpressionData, result: string): Promise<T>;
}
