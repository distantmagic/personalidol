// @flow

import trim from "lodash/trim";
import twig from "twig";

type TwigRendererData = ?{
  [string]: any
};

type TwigRenderer = {
  renderAsync: (data: TwigRendererData) => Promise<string>
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

  async execute(data: TwigRendererData): Promise<string> {
    const response = await this.template.renderAsync(data);

    return trim(response);
  }
}
