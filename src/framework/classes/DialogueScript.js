// @flow

import { Map } from "immutable";

import DialogueMessage from "./DialogueMessage";
import DialogueMetadata from "./DialogueMetadata";

import type { Contextual } from "../interfaces/Contextual";
import type { DialogueMessage as DialogueMessageInterface } from "../interfaces/DialogueMessage";
import type { DialogueMessages } from "../types/DialogueMessages";
import type { DialogueScript as DialogueScriptFormat } from "../types/DialogueScript";
import type { ExpressionBus } from "../interfaces/ExpressionBus";
import type { ExpressionContext } from "../interfaces/ExpressionContext";

export default class DialogueScript implements Contextual {
  +context: ExpressionContext;
  +expressionBus: ExpressionBus;
  +script: DialogueScriptFormat;

  constructor(expressionBus: ExpressionBus, context: ExpressionContext, script: DialogueScriptFormat) {
    this.context = context;
    this.expressionBus = expressionBus;
    this.script = script;
  }

  async getAnswers(prompt: DialogueMessageInterface): Promise<DialogueMessages> {
    const messages = await this.getMessages();
    let ret = Map<string, DialogueMessageInterface>();

    for (let message of messages.toSet().toArray()) {
      if (await message.isAnswerTo(prompt)) {
        ret = ret.set(message.key(), message);
      }
    }

    return ret;
  }

  getExpressionContext(): ExpressionContext {
    return this.context.set("script", this);
  }

  async getMetadata(): Promise<DialogueMetadata> {
    return new DialogueMetadata();
  }

  async getMessages(): Promise<DialogueMessages> {
    let ret = Map<string, DialogueMessageInterface>();

    for (let id in this.script.messages) {
      if (this.script.messages.hasOwnProperty(id)) {
        const message = new DialogueMessage(this.expressionBus, this.getExpressionContext(), id, this.script.messages[id]);

        ret = ret.set(id, message);
      }
    }

    return ret;
  }

  async getStartMessage(): Promise<DialogueMessageInterface> {
    return new DialogueMessage(this.expressionBus, this.getExpressionContext(), this.script.metadata.start_message, this.script.messages[this.script.metadata.start_message]);
  }
}
