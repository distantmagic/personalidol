// @flow

import * as React from "react";
import autoBind from "auto-bind";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";

type Props = {|
  dialogueMessage: DialogueMessage,
  onAnswerClick: DialogueMessage => any
|};

type State = {|
  prompt: null | string
|};

export default class DialogueAnswer extends React.Component<Props, State> {
  state = {
    prompt: null
  };

  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      prompt: await this.props.dialogueMessage.prompt()
    });
  }

  onAnswerClick(evt: SyntheticEvent<any>): void {
    evt.preventDefault();

    this.props.onAnswerClick(this.props.dialogueMessage);
  }

  render() {
    return <button onClick={this.onAnswerClick}>{this.state.prompt}</button>;
  }
}
