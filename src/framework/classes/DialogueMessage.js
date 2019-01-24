// @flow

import Expression from "./Expression";

import type { DialogueMessage as DialogueMessageInterface } from "../interfaces/DialogueMessage";
import type { DialogueScriptMessage } from "../types/DialogueScriptMessage";
import type { Expression as ExpressionInterface } from "../interfaces/Expression";
import type { ExpressionContext } from "../interfaces/ExpressionContext";

export default class DialogueMessage implements DialogueMessageInterface {
  +_key: string;
  +context: ExpressionContext;
  +messageScript: DialogueScriptMessage;

  constructor(
    context: ExpressionContext,
    key: string,
    messageScript: DialogueScriptMessage
  ) {
    this._key = key;
    this.context = context;
    this.messageScript = messageScript;
  }

  async actor(): Promise<string> {
    return this.messageScript.actor;
  }

  async answerTo(): Promise<Array<string>> {
    const answerTo = this.messageScript.answer_to;

    if (Array.isArray(answerTo)) {
      return answerTo;
    }

    if (!answerTo) {
      return [];
    }

    return [answerTo];
  }

  condition(): ?ExpressionInterface {
    const condition = this.messageScript.condition;

    if (condition) {
      return new Expression(condition, this.getExpressionContext());
    }
  }

  expression(): ?ExpressionInterface {
    const expression = this.messageScript.expression;

    if (expression) {
      return new Expression(expression, this.getExpressionContext());
    }
  }

  getExpressionContext(): ExpressionContext {
    return this.context.set("message", this);
  }

  async key(): Promise<string> {
    return this._key;
  }

  async isAnswerTo(other: DialogueMessageInterface): Promise<boolean> {
    const parents = await this.answerTo();

    return parents.includes(await other.key());
  }

  async prompt(): Promise<string> {
    return this.messageScript.prompt;
  }
}
