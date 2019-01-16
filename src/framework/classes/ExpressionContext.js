// @flow

import { Map } from "immutable";

import UnexpectedOverride from "./Exception/Collection/UnexpectedOverride";

import type { ExpressionContext as ExpressionContextInterface } from "../interfaces/ExpressionContext";
import type { ExpressionContextInput } from "../types/ExpressionContextInput";
import type { ExpressionData } from "../types/ExpressionData";

export default class ExpressionContext implements ExpressionContextInterface {
  map: Map<string, any>;

  constructor(elements: ?ExpressionContextInput) {
    this.map = Map<string, any>(elements ? elements : {});
  }

  has(key: string): boolean {
    return this.map.has(key);
  }

  set(key: string, value: any): ExpressionContext {
    if (this.map.has(key)) {
      throw new UnexpectedOverride(
        `Expression context tried to override key: ${key}`
      );
    }

    return new ExpressionContext(this.map.set(key, value));
  }

  toObject(): ExpressionData {
    return this.map.toObject();
  }
}
