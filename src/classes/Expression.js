// @flow

import twig from 'twig';

type TwigRendererData = ?{
  [string]: number | string
};

type TwigRenderer = {
  render: (data: TwigRendererData) => string,
};

export default class Expression {
  expression: string;
  template: TwigRenderer;

  constructor(expression: string): void {
    this.expression = expression;
    this.template = twig.twig({
      data: `{{${expression}}}`,
    });
  }

  execute(data: TwigRendererData): string {
    return this.template.render(data);
  }
}
