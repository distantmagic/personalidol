// @flow

import type { ExpressionCaster } from "../../interfaces/ExpressionCaster";
import type { ExpressionData } from "../../types/ExpressionData";

export default class ExpressionCasterNumber
  implements ExpressionCaster<number> {
  async cast(
    expression: string,
    data: ExpressionData,
    result: string
  ): Promise<number> {
    const casted = parseFloat(result);

    if (isNaN(casted)) {
      throw new Error(
        `Can't convert result to number: "${result}", expression: ${expression}`
      );
    }

    return casted;
  }
}
