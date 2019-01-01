// @flow

import * as React from "react";
import autoBind from "auto-bind";

import { default as DialogueButtonModel } from "../framework/classes/DialogueButton";

type Props = {
  button: DialogueButtonModel
};

type State = {};

export default class DialogueButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  onMessageClick(evt: SyntheticEvent<HTMLButtonElement>) {
    evt.preventDefault();
  }

  render() {
    return (
      <button onClick={this.onMessageClick}>{this.props.button.label()}</button>
    );
  }
}
