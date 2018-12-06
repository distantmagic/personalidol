// @flow

import type { ExpressionCaster } from "../../interfaces/ExpressionCaster";
import type { ExpressionData } from "../../types/ExpressionData";

export default class ExpressionCasterBoolean
  implements ExpressionCaster<boolean> {
  async cast(
    expression: string,
    data: ExpressionData,
    result: string
  ): Promise<boolean> {
    switch (result) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        throw new Error(
          `Can't convert result to boolean: "${result}", expression: ${expression}`
        );
    }
  }
}
