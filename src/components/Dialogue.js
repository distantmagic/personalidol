// @flow

import * as React from "react";

import { default as DialogueTurnComponent } from "./DialogueTurn";
import { default as DialogueClass } from "../framework/classes/Dialogue";

import type { DialogueTurn } from "../framework/interfaces/DialogueTurn";
import type { Identifiable } from "../framework/interfaces/Identifiable";
import type { Logger } from "../framework/interfaces/Logger";
import type { Speaks } from "../framework/interfaces/Sentient/Speaks";

type Props = {|
  dialogue: DialogueClass,
  dialogueInitiator: Identifiable & Speaks,
  logger: Logger
|};

type State = {|
  dialogueTurn: ?DialogueTurn
|};

export default class Dialogue extends React.Component<Props, State> {
  state = {
    dialogueTurn: null
  };

  async componentDidMount(): Promise<void> {
    this.setState({
      dialogueTurn: await this.props.dialogue.initiate(
        this.props.dialogueInitiator
      )
    });
  }

  render() {
    const dialogueTurn = this.state.dialogueTurn;

    if (!dialogueTurn) {
      return <div>Loading...</div>;
    }

    return (
      <DialogueTurnComponent
        dialogueTurn={dialogueTurn}
        logger={this.props.logger}
      />
    );
  }
}
