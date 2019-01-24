// @flow

import { Map } from "immutable";

import DialogueScript from "./DialogueScript";

import type { DialogueMessage as DialogueMessageInterface } from "../interfaces/DialogueMessage";
import type { DialogueMessages } from "../types/DialogueMessages";
import type { DialogueTurn as DialogueTurnInterface } from "../interfaces/DialogueTurn";
import type { ExpressionBus } from "../interfaces/ExpressionBus";
import type { ExpressionContext } from "../interfaces/ExpressionContext";
import type { Speaks } from "../interfaces/Sentient/Speaks";

export default class DialogueTurn implements DialogueTurnInterface {
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
    this.currentMessage = currentMessage;
    this.expressionBus = expressionBus;
    this.initiator = initiator;
    this.script = script;
  }

  actor(): Promise<string> {
    return this.currentMessage.actor();
  }

  async answer(
    answer: DialogueMessageInterface
  ): Promise<?DialogueTurnInterface> {
    const followUp = await this.followUpAnswer(answer);

    if (!followUp) {
      return;
    }

    return new DialogueTurn(
      this.expressionBus,
      this.context,
      this.script,
      followUp,
      this.initiator
    );
  }

  async answers(): Promise<DialogueMessages> {
    const answers = await this.script.getAnswers(this.currentMessage);
    let ret = Map<string, DialogueMessageInterface>();

    for (let answer of answers.toSet().toArray()) {
      const condition = answer.condition();

      if (!condition || (await this.expressionBus.condition(condition))) {
        ret = ret.set(await answer.key(), answer);
      }
    }

    return ret;
  }

  async followUpAnswer(
    answer: DialogueMessageInterface
  ): Promise<?DialogueMessageInterface> {
    const answers = await this.script.getAnswers(answer);

    return answers.first();
  }

  getExpressionContext(): ExpressionContext {
    return this.context.set("turn", this);
  }

  prompt(): Promise<string> {
    return this.currentMessage.prompt();
  }
}
