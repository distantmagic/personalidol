// @flow

import * as React from "react";
import autoBind from "auto-bind";

type Props = {
  button: string
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
    return <button onClick={this.onMessageClick}>{this.props.button}</button>;
  }
}
