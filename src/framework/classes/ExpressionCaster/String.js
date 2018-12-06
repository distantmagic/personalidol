// @flow

import type { ExpressionCaster } from "../../interfaces/ExpressionCaster";
import type { ExpressionData } from "../../types/ExpressionData";

export default class ExpressionCasterString
  implements ExpressionCaster<string> {
  async cast(
    expression: string,
    data: ExpressionData,
    result: string
  ): Promise<string> {
    return result;
  }
}
