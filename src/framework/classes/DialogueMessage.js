// @flow

import type { DialogueFragment } from "../interfaces/DialogueFragment";
import type { DialogueScriptMessage } from "../types/DialogueScriptMessage";

export default class DialogueMessage implements DialogueFragment {
  messageScript: DialogueScriptMessage;

  constructor(messageScript: DialogueScriptMessage) {
    this.messageScript = messageScript;
  }

  async prompt(): Promise<string> {
    return this.messageScript.prompt;
  }
}
