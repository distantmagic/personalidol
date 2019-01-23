// @flow

import { Map } from "immutable";

import DialogueMessage from "./DialogueMessage";
import DialogueMetadata from "./DialogueMetadata";

import type { DialogueScript as DialogueScriptFormat } from "../types/DialogueScript";
import type { DialogueMessage as DialogueMessageInterface } from "../interfaces/DialogueMessage";
import type { DialogueMessages } from "../types/DialogueMessages";

export default class DialogueScript {
  +script: DialogueScriptFormat;

  constructor(script: DialogueScriptFormat) {
    this.script = script;
  }

  async getAnswers(
    prompt: DialogueMessageInterface
  ): Promise<DialogueMessages> {
    const messages = await this.getMessages();
    let ret = Map<string, DialogueMessageInterface>();

    for (let message of messages.toSet().toArray()) {
      if (await message.isAnswerTo(prompt)) {
        ret = ret.set(await message.key(), message);
      }
    }

    return ret;
  }

  async getMetadata(): Promise<DialogueMetadata> {
    return new DialogueMetadata();
  }

  async getMessages(): Promise<DialogueMessages> {
    let ret = Map<string, DialogueMessageInterface>();

    for (let id in this.script.messages) {
      if (this.script.messages.hasOwnProperty(id)) {
        ret = ret.set(id, new DialogueMessage(id, this.script.messages[id]));
      }
    }

    return ret;
  }

  async getStartMessage(): Promise<DialogueMessageInterface> {
    return new DialogueMessage(
      this.script.metadata.start_message,
      this.script.messages[this.script.metadata.start_message]
    );
  }
}
