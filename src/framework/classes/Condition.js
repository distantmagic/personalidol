// @flow

import yn from "yn";

export default class Condition {
  +expressionResult: string;

  constructor(expressionResult: string) {
    this.expressionResult = expressionResult;
  }

  async interpret(): Promise<boolean> {
    const result = yn(this.expressionResult);

    if ("boolean" !== typeof result) {
      throw new Error(`Invalid condition expression: ${this.expressionResult}`);
    }

    return result;
  }
}
