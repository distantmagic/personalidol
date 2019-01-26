// @flow

import * as React from "react";

import type { DialogueTurn as DialogueTurnInterface } from "../framework/interfaces/DialogueTurn";
import type { Logger } from "../framework/interfaces/Logger";

type Props = {|
  dialogueTurn: DialogueTurnInterface,
  logger: Logger
|};

type State = {|
  prompt: ?string
|};

export default class DialogueTurn extends React.Component<Props, State> {
  state = {
    prompt: null
  };

  async componentDidMount(): Promise<void> {
    this.setState({
      prompt: await this.props.dialogueTurn.prompt()
    });
  }

  render() {
    return <div>{this.state.prompt}</div>;
  }
}
