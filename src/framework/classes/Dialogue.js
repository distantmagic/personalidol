// @flow

import DialogueMessage from "./DialogueMessage";

import type { DialogueScript } from "../types/DialogueScript";

export default class Dialogue {
  script: DialogueScript;

  constructor(script: DialogueScript) {
    this.script = script;
  }

  initialMessage(): DialogueMessage {
    const messageScript = this.script.messages[this.script.initial_message];

    return new DialogueMessage(
      this.script,
      messageScript,
      this.script.initial_message
    );
  }
}
