// @flow

import DialogueMessage from "./DialogueMessage";

import type { Contextual } from "../interfaces/Contextual";
import type { DialogueScript } from "../types/DialogueScript";
import type { ExpressionBus } from "../interfaces/ExpressionBus";
import type { ExpressionContext } from "../interfaces/ExpressionContext";

export default class Dialogue implements Contextual {
  context: ExpressionContext;
  expressionBus: ExpressionBus;
  script: DialogueScript;

  constructor(
    expressionBus: ExpressionBus,
    context: ExpressionContext,
    script: DialogueScript
  ) {
    this.context = context;
    this.expressionBus = expressionBus;
    this.script = script;
  }

  getExpressionContext(): ExpressionContext {
    return this.context.set("dialogue", this);
  }

  async initiator(): Promise<string> {
    return "Abdel";
  }

  start(): DialogueMessage {
    const messageScript = this.script.messages[this.script.initial_message];

    return new DialogueMessage(
      this.expressionBus,
      this.script,
      messageScript,
      this.script.initial_message,
      this.getExpressionContext()
    );
  }
}
