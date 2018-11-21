// @flow

export default class DialogueMessageFeedback {
  feedback: Object;

  constructor(feedback: Object) {
    this.feedback = feedback;
  }

  label(): string {
    return this.feedback.label;
  }
}
