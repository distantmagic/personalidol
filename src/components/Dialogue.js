// @flow

import * as React from "react";
import autoBind from "auto-bind";

import { default as DialogueTurnComponent } from "./DialogueTurn";
import { default as DialogueClass } from "../framework/classes/Dialogue";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
import type { DialogueTurn } from "../framework/interfaces/DialogueTurn";
import type { Identifiable } from "../framework/interfaces/Identifiable";
import type { Logger } from "../framework/interfaces/Logger";
import type { Speaks } from "../framework/interfaces/Sentient/Speaks";

type Props = {|
  dialogue: DialogueClass,
  dialogueInitiator: Identifiable & Speaks,
  logger: Logger,
  onDialogueEnd: () => any
|};

type State = {|
  dialogueTurn: ?DialogueTurn
|};

export default class Dialogue extends React.Component<Props, State> {
  state = {
    dialogueTurn: null
  };

  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      dialogueTurn: await this.props.dialogue.initiate(
        this.props.dialogueInitiator
      )
    });
  }

  async onAnswerClick(message: DialogueMessage): Promise<void> {
    const dialogueTurn = this.state.dialogueTurn;

    if (!dialogueTurn) {
      return;
    }

    this.setState({
      dialogueTurn: null
    });

    const nextDialogueTurn = await dialogueTurn.answer(message);

    if (nextDialogueTurn) {
      this.setState({
        dialogueTurn: nextDialogueTurn
      });
    } else {
      this.props.onDialogueEnd();
    }
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
        onAnswerClick={this.onAnswerClick}
        onDialogueEnd={this.props.onDialogueEnd}
      />
    );
  }
}
