// @flow

import DialogueScript from "./DialogueScript";

import type { DialogueFragment } from "../interfaces/DialogueFragment";
import type { DialogueMessage as DialogueMessageInterface } from "../interfaces/DialogueMessage";
import type { DialogueMessages } from "../types/DialogueMessages";
import type { ExpressionBus } from "../interfaces/ExpressionBus";
import type { ExpressionContext } from "../interfaces/ExpressionContext";
import type { Speaks } from "../interfaces/Sentient/Speaks";

export default class DialogueTurn implements DialogueFragment {
  +context: ExpressionContext;
  +expressionBus: ExpressionBus;
  +initiator: Speaks;
  +currentMessage: DialogueMessageInterface;
  +script: DialogueScript;

  constructor(
    expressionBus: ExpressionBus,
    context: ExpressionContext,
    script: DialogueScript,
    currentMessage: DialogueMessageInterface,
    initiator: Speaks
  ) {
    this.context = context;
    this.expressionBus = expressionBus;
    this.initiator = initiator;
    this.currentMessage = currentMessage;
    this.script = script;
  }

  answers(): Promise<DialogueMessages> {
    return this.script.getAnswers(this.currentMessage);
  }

  actor(): Promise<string> {
    return this.currentMessage.actor();
  }

  prompt(): Promise<string> {
    return this.currentMessage.prompt();
  }
}
