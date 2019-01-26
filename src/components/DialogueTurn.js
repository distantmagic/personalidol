// @flow

import { Map } from "immutable";

import * as React from "react";

import DialogueAnswer from "./DialogueAnswer";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
import type { DialogueTurn as DialogueTurnInterface } from "../framework/interfaces/DialogueTurn";
import type { Logger } from "../framework/interfaces/Logger";

type Props = {|
  dialogueTurn: DialogueTurnInterface,
  logger: Logger,
  onAnswerClick: DialogueMessage => any
|};

type State = {|
  answers: ?Map<string, DialogueMessage>,
  prompt: ?string
|};

export default class DialogueTurn extends React.Component<Props, State> {
  state = {
    answers: null,
    prompt: null
  };

  async componentDidMount(): Promise<void> {
    this.setState({
      answers: await this.props.dialogueTurn.answers(),
      prompt: await this.props.dialogueTurn.prompt()
    });
  }

  render() {
    const answers = this.state.answers;

    if (!answers) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        {this.state.prompt}
        <ol>
          {answers
            .toSet()
            .toArray()
            .map(dialogueMessage => (
              <li key={dialogueMessage.key()}>
                <DialogueAnswer
                  dialogueMessage={dialogueMessage}
                  onAnswerClick={this.props.onAnswerClick}
                />
              </li>
            ))}
        </ol>
      </div>
    );
  }
}
