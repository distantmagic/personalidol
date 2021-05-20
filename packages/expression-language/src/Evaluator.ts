import jexl from "jexl";

import type { Evaluator as IEvaluator } from "./Evaluator.interface";
import type { EvaluatorContext } from "./EvaluatorContext.type";

export function Evaluator(context: EvaluatorContext = {}): IEvaluator {
  function evaluate(expression: string): Promise<boolean | number | string> {
    return jexl.eval(expression, context);
  }

  return Object.freeze({
    evaluate: evaluate,
  });
}
