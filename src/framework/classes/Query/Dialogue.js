// @flow

import YAML from "yaml";

import { default as DialogueResourceReference } from "../ResourceReference/Dialogue";
import { default as DialogueModel } from "../Dialogue";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { ExpressionBus } from "../../interfaces/ExpressionBus";
import type { ExpressionContext } from "../../interfaces/ExpressionContext";
import type { Query } from "../../interfaces/Query";

export default class Dialogue implements Query<DialogueModel> {
  context: ExpressionContext;
  expressionBus: ExpressionBus;
  ref: DialogueResourceReference;

  constructor(
    expressionBus: ExpressionBus,
    context: ExpressionContext,
    ref: DialogueResourceReference
  ) {
    this.context = context;
    this.expressionBus = expressionBus;
    this.ref = ref;
  }

  async execute(cancelToken?: CancelToken): Promise<DialogueModel> {
    const response = await fetch(this.ref.getReference());
    const dialogue = await response.text();

    return new DialogueModel(
      this.expressionBus,
      this.context,
      YAML.parse(dialogue)
    );
  }

  isEqual(other: Dialogue): boolean {
    return this.ref.isEqual(other.ref);
  }
}
