// @flow

import { Map } from "immutable";

import DialogueMessage from "./DialogueMessage";
import DialogueScript from "./DialogueScript";

import type { DialogueMessage as DialogueMessageInterface } from "../interfaces/DialogueMessage";
import type { DialogueMessages } from "../types/DialogueMessages";
import type { DialogueTurn as DialogueTurnInterface } from "../interfaces/DialogueTurn";
import type { ExpressionBus } from "../interfaces/ExpressionBus";
import type { ExpressionContext } from "../interfaces/ExpressionContext";
import type { Identifiable } from "../interfaces/Identifiable";
import type { Speaks } from "../interfaces/Sentient/Speaks";

export default class DialogueTurn implements DialogueTurnInterface {
  +_initiator: Identifiable & Speaks;
  +context: ExpressionContext;
  +currentMessage: DialogueMessageInterface;
  +expressionBus: ExpressionBus;
  +script: DialogueScript;

  constructor(
    expressionBus: ExpressionBus,
    context: ExpressionContext,
    script: DialogueScript,
    currentMessage: DialogueMessageInterface,
    initiator: Identifiable & Speaks
  ) {
    this._initiator = initiator;
    this.context = context;
    this.currentMessage = currentMessage;
    this.expressionBus = expressionBus;
    this.script = script;
  }

  async actor(): Promise<string> {
    const currentMessage = await this.getCurrentMessage();

    return currentMessage.actor();
  }

  async answer(answer: DialogueMessageInterface): Promise<?DialogueTurnInterface> {
    const followUp = await this.followUpAnswer(answer);

    if (!followUp) {
      return;
    }

    return new DialogueTurn(this.expressionBus, this.context, this.script, followUp, this._initiator);
  }

  async answers(): Promise<DialogueMessages> {
    const currentMessage = await this.getCurrentMessage();
    const answers = await this.script.getAnswers(currentMessage);
    let ret = Map<string, DialogueMessageInterface>();

    for (let answer of answers.toSet().toArray()) {
      const condition = answer.condition();

      if (!condition || (await this.expressionBus.condition(condition))) {
        ret = ret.set(
          answer.key(),
          new DialogueMessage(this.expressionBus, this.getExpressionContext(), answer.key(), answer.getMessageScript())
        );
      }
    }

    return ret;
  }

  async followUpAnswer(answer: DialogueMessageInterface): Promise<?DialogueMessageInterface> {
    const answers = await this.script.getAnswers(answer);

    return answers.first();
  }

  async getCurrentMessage(): Promise<DialogueMessageInterface> {
    return new DialogueMessage(
      this.expressionBus,
      this.getExpressionContext(),
      this.currentMessage.key(),
      this.currentMessage.getMessageScript()
    );
  }

  async getIllustration(): Promise<?string> {
    const messageScript = await this.currentMessage.getMessageScript();

    return messageScript.illustration;
  }

  async initiator(): Promise<Identifiable & Speaks> {
    return this._initiator;
  }

  getExpressionContext(): ExpressionContext {
    return this.context.set("turn", this);
  }

  async prompt(): Promise<string> {
    const currentMessage = await this.getCurrentMessage();

    return currentMessage.prompt();
  }
}
