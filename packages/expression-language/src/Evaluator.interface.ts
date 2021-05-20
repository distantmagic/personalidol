export interface Evaluator {
  evaluate(expression: string): Promise<boolean | number | string>;
}
