// @flow

import type { Expression } from "./Expression";

export interface ExpressionBus {
  enqueue<T>(Expression<T>): Promise<T>;
}
