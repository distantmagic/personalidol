// @flow

import type { Contextual } from "./Contextual";
import type { Expression } from "./Expression";

export interface Expressible extends Contextual {
  expression(): ?Expression;
}
