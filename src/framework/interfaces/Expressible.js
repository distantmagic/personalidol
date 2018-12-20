// @flow

import type { Expression } from "./Expression";

export interface Expressible<T> {
  expression(): ?Expression<T>;
}
