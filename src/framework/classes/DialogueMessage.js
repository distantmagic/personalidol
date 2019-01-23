// @flow

import type { DialogueMessage as DialogueMessageInterface } from "../interfaces/DialogueMessage";
import type { DialogueScriptMessage } from "../types/DialogueScriptMessage";

export default class DialogueMessage implements DialogueMessageInterface {
  +_key: string;
  +messageScript: DialogueScriptMessage;

  constructor(key: string, messageScript: DialogueScriptMessage) {
    this._key = key;
    this.messageScript = messageScript;
  }

  async actor(): Promise<string> {
    return this.messageScript.actor;
  }

  async answerTo(): Promise<?string> {
    return this.messageScript.answer_to;
  }

  async key(): Promise<string> {
    return this._key;
  }

  async isAnswerTo(other: DialogueMessageInterface): Promise<boolean> {
    return (await other.key()) === (await this.answerTo());
  }

  async prompt(): Promise<string> {
    return this.messageScript.prompt;
  }
}
