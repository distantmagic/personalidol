// @flow

import { Map } from "immutable";

import * as React from "react";
import autoBind from "auto-bind";

import DialogueAnswer from "./DialogueAnswer";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
import type { DialogueTurn as DialogueTurnInterface } from "../framework/interfaces/DialogueTurn";
import type { Logger } from "../framework/interfaces/Logger";

type Props = {|
  dialogueTurn: DialogueTurnInterface,
  logger: Logger,
  onAnswerClick: DialogueMessage => any,
  onDialogueEnd: () => any
|};

type State = {|
  actor: ?string,
  answers: ?Map<string, DialogueMessage>,
  prompt: ?string
|};

export default class DialogueTurn extends React.Component<Props, State> {
  state = {
    actor: null,
    answers: null,
    prompt: null
  };

  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  async componentDidMount(): Promise<void> {
    const answers = await this.props.dialogueTurn.answers();

    this.setState({
      actor: await this.props.dialogueTurn.actor(),
      answers: answers,
      prompt: await this.props.dialogueTurn.prompt()
    });
  }

  onDialogueEndClick(evt: SyntheticEvent<any>) {
    evt.preventDefault();

    this.props.onDialogueEnd();
  }

  render() {
    const answers = this.state.answers;

    if (!answers) {
      return <div>Loading...</div>;
    }

    return (
      <div className="dialogue__turn">
        <div className="dialogue__turn__actor">{this.state.actor}</div>
        <div className="dialogue__turn__prompt">{this.state.prompt}</div>
        {answers.isEmpty() ? (
          <button onClick={this.onDialogueEndClick}>End dialogue</button>
        ) : (
          <ol className="dialogue__turn__answers">
            {answers
              .toSet()
              .toArray()
              .map(dialogueMessage => (
                <li
                  className="dialogue__turn__answer"
                  key={dialogueMessage.key()}
                >
                  <DialogueAnswer
                    dialogueMessage={dialogueMessage}
                    onAnswerClick={this.props.onAnswerClick}
                  />
                </li>
              ))}
          </ol>
        )}
      </div>
    );
  }
}
