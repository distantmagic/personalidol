// @flow

import React from "react";

import { default as DialogueMessageFeedbackModel } from "../domain/DialogueMessageFeedback";

type Props = {
  feedback: DialogueMessageFeedbackModel
};

export default class DialogueMessageFeedback extends React.Component<Props> {
  render() {
    return <li>{this.props.feedback.label()}</li>;
  }
}
