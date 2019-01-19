// @flow

import DialogueMessage from "./DialogueMessage";
import DialogueScript from "./DialogueScript";

import type { DialogueFragment } from "../interfaces/DialogueFragment";
import type { ExpressionBus } from "../interfaces/ExpressionBus";
import type { ExpressionContext } from "../interfaces/ExpressionContext";
import type { Speaks } from "../interfaces/Sentient/Speaks";

export default class DialogueTurn implements DialogueFragment {
  context: ExpressionContext;
  expressionBus: ExpressionBus;
  initiator: Speaks;
  currentMessage: DialogueMessage;
  script: DialogueScript;

  constructor(
    expressionBus: ExpressionBus,
    context: ExpressionContext,
    script: DialogueScript,
    currentMessage: DialogueMessage,
    initiator: Speaks
  ) {
    this.context = context;
    this.expressionBus = expressionBus;
    this.initiator = initiator;
    this.currentMessage = currentMessage;
    this.script = script;
  }

  prompt(): Promise<string> {
    return this.currentMessage.prompt();
  }
}
