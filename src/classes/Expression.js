// @flow

import twig from 'twig';

export default class Expression {
  expression: string;

  constructor(expression: string): void {
    this.expression = expression;
    this.template = twig.twig({
      data: `{{${expression}}}`,
    });
  }

  execute(data: ?object): Promise<string> {
    return Promise.resolve(this.template.render(data));
  }
}
