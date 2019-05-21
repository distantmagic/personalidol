// @flow

import DialogueScript from "./DialogueScript";
import DialogueTurn from "./DialogueTurn";

import type { Contextual } from "../interfaces/Contextual";
import type { ExpressionBus } from "../interfaces/ExpressionBus";
import type { ExpressionContext } from "../interfaces/ExpressionContext";
import type { Identifiable } from "../interfaces/Identifiable";
import type { Speaks } from "../interfaces/Sentient/Speaks";

export default class Dialogue implements Contextual {
  +context: ExpressionContext;
  +expressionBus: ExpressionBus;
  +script: DialogueScript;

  constructor(expressionBus: ExpressionBus, context: ExpressionContext, script: DialogueScript) {
    this.context = context;
    this.expressionBus = expressionBus;
    this.script = script;
  }

  getExpressionContext(): ExpressionContext {
    return this.context.set("dialogue", this);
  }

  async initiate(initiator: Identifiable & Speaks): Promise<DialogueTurn> {
    return new DialogueTurn(
      this.expressionBus,
      this.getExpressionContext(),
      this.script,
      await this.script.getStartMessage(),
      initiator
    );
  }
}
