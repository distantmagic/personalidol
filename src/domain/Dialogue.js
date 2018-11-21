// @flow

import DialogueMessage from "./DialogueMessage";

export default class Dialogue {
  messages: Array<DialogueMessage>;

  constructor(messages: Array<DialogueMessage>) {
    this.messages = messages;
  }

  getMessages(): Array<DialogueMessage> {
    return this.messages;
  }
}
