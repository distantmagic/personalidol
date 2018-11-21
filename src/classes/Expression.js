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

  after(response: string) {
    return trim(response);
  }

  execute(data: TwigRendererData): Promise<string> {
    return this.template.renderAsync(data).then(this.after);
  }
}
