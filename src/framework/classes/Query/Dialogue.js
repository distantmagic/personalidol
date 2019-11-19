// @flow

import YAML from "yaml";

import DialogueScript from "../DialogueScript";
import { default as DialogueModel } from "../Dialogue";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { ExpressionBus } from "../../interfaces/ExpressionBus";
import type { ExpressionContext } from "../../interfaces/ExpressionContext";
import type { Query } from "../../interfaces/Query";

export default class Dialogue implements Query<DialogueModel> {
  +context: ExpressionContext;
  +expressionBus: ExpressionBus;
  +ref: string;

  constructor(expressionBus: ExpressionBus, context: ExpressionContext, ref: string) {
    this.context = context;
    this.expressionBus = expressionBus;
    this.ref = ref;
  }

  async execute(cancelToken: CancelToken): Promise<DialogueModel> {
    const response = await fetch(this.ref, {
      signal: cancelToken.getAbortSignal(),
    });
    const dialogue = await response.text();

    return new DialogueModel(this.expressionBus, this.context, new DialogueScript(this.expressionBus, this.context, YAML.parse(dialogue)));
  }

  isEqual(other: Dialogue): boolean {
    return this.ref === other.ref;
  }
}
