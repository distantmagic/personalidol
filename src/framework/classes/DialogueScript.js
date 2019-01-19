// @flow

import DialogueMessage from "./DialogueMessage";
import DialogueMessages from "./DialogueMessages";
import DialogueMetadata from "./DialogueMetadata";

import type { DialogueScript as DialogueScriptFormat } from "../types/DialogueScript";

export default class DialogueScript {
  script: DialogueScriptFormat;

  constructor(script: DialogueScriptFormat) {
    this.script = script;
  }

  getMetadata(): DialogueMetadata {
    return new DialogueMetadata();
  }

  getMessages(): DialogueMessages {
    return new DialogueMessages();
  }

  async getStartMessage(): Promise<DialogueMessage> {
    return new DialogueMessage(
      this.script.messages[this.script.metadata.start_message]
    );
  }
}
