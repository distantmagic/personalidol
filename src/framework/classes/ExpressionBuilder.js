// @flow

import Expression from "./Expression";
import ExpressionCasterBoolean from "./ExpressionCaster/Boolean";
import ExpressionCasterNumber from "./ExpressionCaster/Number";
import ExpressionCasterString from "./ExpressionCaster/String";

export default class ExpressionBuilder {
  static boolean(expression: string): Expression<boolean> {
    return new Expression<boolean>(expression, new ExpressionCasterBoolean());
  }

  static number(expression: string): Expression<number> {
    return new Expression<number>(expression, new ExpressionCasterNumber());
  }

  static string(expression: string): Expression<string> {
    return new Expression<string>(expression, new ExpressionCasterString());
  }
}
