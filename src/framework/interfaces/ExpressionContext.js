// @flow

import type { TwigRendererData } from "twig";

export interface ExpressionContext {
  set(key: string, value: any): ExpressionContext;

  toObject(): TwigRendererData;
}
