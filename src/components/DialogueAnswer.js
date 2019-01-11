// @flow

import * as React from "react";
import autoBind from "auto-bind";

import DialogueMessage from "../framework/classes/DialogueMessage";

type Props = {
  actor: string,
  answer: DialogueMessage,
  prompt: string
};

type State = {};

export default class DialogueButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  onMessageClick(evt: SyntheticEvent<HTMLButtonElement>) {
    evt.preventDefault();

    console.log(this.props.answer.key());
  }

  render() {
    return (
      <span>
        {this.props.actor}
        {" - "}
        <button onClick={this.onMessageClick}>{this.props.prompt}</button>
      </span>
    );
  }
}
