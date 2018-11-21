// @flow

import DialogueMessageFeedback from "./DialogueMessageFeedback";

export default class DialogueMessage {
  message: Object;

  constructor(message: Object) {
    this.message = message;
  }

  feedback(): ?Array<DialogueMessageFeedback> {
    if (!this.message.feedback) {
      return null;
    }

    return this.message.feedback.map(
      feedback => new DialogueMessageFeedback(feedback)
    );
  }

  label(): string {
    return this.message.label;
  }
}
