// @flow

import type { Expression } from "./Expression";

export interface Expressible {
  expression(): ?Expression;
}
