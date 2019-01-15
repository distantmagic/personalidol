// @flow

import Collection from "./Collection";
import Expression from "./Expression";

import type { Contextual } from "../interfaces/Contextual";
import type { DialogueScript } from "../types/DialogueScript";
import type { DialogueScriptMessage } from "../types/DialogueScriptMessage";
import type { Equatable } from "../interfaces/Equatable";
import type { Expressible } from "../interfaces/Expressible";
import type { ExpressionBus } from "../interfaces/ExpressionBus";
import type { ExpressionContext } from "../interfaces/ExpressionContext";

export default class DialogueMessage
  implements Contextual, Equatable<DialogueMessage>, Expressible {
  _key: string;
  context: ExpressionContext;
  expressionBus: ExpressionBus;
  message: DialogueScriptMessage;
  script: DialogueScript;

  constructor(
    expressionBus: ExpressionBus,
    script: DialogueScript,
    message: DialogueScriptMessage,
    key: string,
    context: ExpressionContext
  ) {
    this._key = key;
    this.context = context;
    this.expressionBus = expressionBus;
    this.message = message;
    this.script = script;
  }

  actor(): Promise<string> {
    return this.expressionBus.enqueue(
      new Expression(this.message.actor, this.getExpressionContext())
    );
  }

  async answers(): Promise<Collection<DialogueMessage>> {
    const answers = [];

    for (let key in this.script.messages) {
      if (this.script.messages.hasOwnProperty(key)) {
        let answer = this.script.messages[key];
        if (this.canBeAnsweredWithScriptMessage(answer)) {
          answers.push(
            new DialogueMessage(
              this.expressionBus,
              this.script,
              answer,
              key,
              this.context
            )
          );
        }
      }
    }

    return new Collection(answers);
  }

  canBeAnsweredWithScriptMessage(message: DialogueScriptMessage): boolean {
    return message.answer_to === this.key();
  }

  expression(): ?Expression {
    if (!this.message.expression) {
      return null;
    }

    return new Expression(this.message.expression, this.getExpressionContext());
  }

  getExpressionContext(): ExpressionContext {
    return this.context.set("message", this);
  }

  isEqual(other: DialogueMessage) {
    return this.key() === other.key();
  }

  key(): string {
    return this._key;
  }

  prompt(): Promise<string> {
    const expression = new Expression(
      this.message.prompt,
      this.getExpressionContext()
    );

    return this.expressionBus.enqueue(expression);
  }
}
