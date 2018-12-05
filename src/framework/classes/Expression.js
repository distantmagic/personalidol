// @flow

import trim from "lodash/trim";
import twig from "twig";

type ExpressionData = ?{
  [string]: any
};

type TwigRenderer = {
  renderAsync: (data: ExpressionData) => Promise<string>
};

export default class Expression {
  expression: string;
  template: TwigRenderer;

  constructor(expression: string): void {
    this.expression = expression;
    this.template = twig.twig({
      data: `${expression}`
    });
  }

  async execute(data: ExpressionData): Promise<string> {
    const response = await this.template.renderAsync(data);

    return trim(response);
  }
}
