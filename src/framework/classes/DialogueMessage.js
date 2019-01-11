// @flow

import Collection from "./Collection";
import Expression from "./Expression";
import { default as StringExpressionCaster } from "./ExpressionCaster/String";

import type { DialogueScript } from "../types/DialogueScript";
import type { DialogueScriptMessage } from "../types/DialogueScriptMessage";
import type { Equatable } from "../interfaces/Equatable";
import type { Expressible } from "../interfaces/Expressible";
import type { ExpressionBus } from "../interfaces/ExpressionBus";

export default class DialogueMessage
  implements Equatable<DialogueMessage>, Expressible<any> {
  _key: string;
  message: DialogueScriptMessage;
  script: DialogueScript;

  constructor(
    script: DialogueScript,
    message: DialogueScriptMessage,
    key: string
  ) {
    this._key = key;
    this.message = message;
    this.script = script;
  }

  async actor(expressionBus: ExpressionBus): Promise<string> {
    const caster = new StringExpressionCaster();

    return expressionBus.enqueue(
      new Expression<string>(this.message.actor, caster)
    );
  }

  async answers(
    expressionBus: ExpressionBus
  ): Promise<Collection<DialogueMessage>> {
    const answers = [];

    for (let key in this.script.messages) {
      if (this.script.messages.hasOwnProperty(key)) {
        let answer = this.script.messages[key];
        if (this.canBeAnsweredWithScriptMessage(answer)) {
          answers.push(new DialogueMessage(this.script, answer, key));
        }
      }
    }

    return new Collection(answers);
  }

  canBeAnsweredWithScriptMessage(message: DialogueScriptMessage): boolean {
    return message.answer_to === this.key();
  }

  expression(): ?Expression<string> {
    if (!this.message.expression) {
      return null;
    }

    const caster = new StringExpressionCaster();

    return new Expression<string>(this.message.expression, caster);
  }

  isEqual(other: DialogueMessage) {
    return this.key() === other.key();
  }

  key(): string {
    return this._key;
  }

  async prompt(expressionBus: ExpressionBus): Promise<string> {
    const caster = new StringExpressionCaster();

    return expressionBus.enqueue(
      new Expression<string>(this.message.prompt, caster)
    );
  }
}
