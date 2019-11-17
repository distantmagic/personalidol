// @flow

import twig from "twig";

import type { TwigRenderer } from "twig";

import type { Expression as ExpressionInterface } from "../interfaces/Expression";
import type { ExpressionContext as ExpressionContextInterface } from "../interfaces/ExpressionContext";

export default class Expression implements ExpressionInterface {
  +context: ExpressionContextInterface;
  +expression: string;
  +template: TwigRenderer;

  constructor(expression: string, context: ExpressionContextInterface): void {
    this.context = context;
    this.expression = expression;
    this.template = twig.twig({
      allow_async: true,
      data: expression,
      // debug: process.env.REACT_APP_DEBUG,
      rethrow: true,
      strict_variables: true,
    });
  }

  async execute(): Promise<string> {
    return this.template.renderAsync(this.context.toObject());
  }
}
