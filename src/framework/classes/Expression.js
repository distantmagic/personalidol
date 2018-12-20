// @flow

import trim from "lodash/trim";
import twig from "twig";

import type { Expression as ExpressionInterface } from "../interfaces/Expression";
import type { ExpressionCaster } from "../interfaces/ExpressionCaster";
import type { ExpressionData } from "../types/ExpressionData";

type TwigRenderer = {
  renderAsync: (data: ExpressionData) => Promise<string>
};

export default class Expression<T> implements ExpressionInterface<T> {
  caster: ExpressionCaster<T>;
  expression: string;
  template: TwigRenderer;

  constructor(expression: string, caster: ExpressionCaster<T>): void {
    this.caster = caster;
    this.expression = expression;
    this.template = twig.twig({
      data: `${expression}`
    });
  }

  async execute(data: ExpressionData): Promise<T> {
    const result = await this.template.renderAsync(data);

    return this.caster.cast(this.expression, data, trim(result));
  }
}
