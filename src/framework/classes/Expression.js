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
  data: ExpressionData;
  expression: string;
  template: TwigRenderer;

  constructor(
    expression: string,
    caster: ExpressionCaster<T>,
    data: ExpressionData
  ): void {
    this.caster = caster;
    this.data = data;
    this.expression = expression;
    this.template = twig.twig({
      data: `${expression}`
    });
  }

  async execute(): Promise<T> {
    const result = await this.template.renderAsync({
      ...this.data,
      CHARNAME: "Abdel"
    });

    return this.caster.cast(this.expression, this.data, trim(result));
  }
}
