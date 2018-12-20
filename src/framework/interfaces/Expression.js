// @flow

import type { ExpressionData } from "../types/ExpressionData";

export interface Expression<T> {
  execute(data: ExpressionData): Promise<T>;
}
