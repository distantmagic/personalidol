// @flow

import twig from "twig";

import ExpressionContext from "./ExpressionContext";

import type { Expression as ExpressionInterface } from "../interfaces/Expression";
import type { ExpressionContext as ExpressionContextInterface } from "../interfaces/ExpressionContext";
import type { ExpressionData } from "../types/ExpressionData";

type TwigRenderer = {
  renderAsync: (data: ExpressionData) => Promise<string>
};

export default class Expression implements ExpressionInterface {
  context: ExpressionContextInterface;
  expression: string;
  template: TwigRenderer;

  constructor(expression: string, context: ?ExpressionContextInterface): void {
    this.context = context || new ExpressionContext();
    this.expression = expression;
    this.template = twig.twig({
      data: `${expression}`
    });
  }

  async execute(): Promise<string> {
    return await this.template.renderAsync(this.context.toObject());
  }
}
