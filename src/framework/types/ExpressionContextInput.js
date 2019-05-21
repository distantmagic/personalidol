// @flow

import type { Map } from "immutable";

export type ExpressionContextInput =
  | Map<string, any>
  | {
      [string]: any,
    };
