// @flow

import { Map } from "immutable";

import * as React from "react";
import autoBind from "auto-bind";
import ReactMarkdown from "react-markdown";

import DialogueAnswer from "./DialogueAnswer";
import DialogueSpinner from "./DialogueSpinner";

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
  illustration: ?string,
  prompt: ?string
|};

export default class DialogueTurn extends React.Component<Props, State> {
  state = {
    actor: null,
    answers: null,
    illustration: null,
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
      illustration: await this.props.dialogueTurn.getIllustration(),
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
      return <DialogueSpinner />;
    }

    const illustration = this.state.illustration;

    return (
      <div className="dd__dialogue__turn">
        {illustration && (
          <div className="dd__dialogue__turn__illustration">
            <img
              alt="Illustration"
              className="dd__dialogue__turn__illustration__image"
              src={`/assets/image-manuscript-header.png`}
            />
          </div>
        )}
        <h1 className="dd__dialogue__turn__title">
          Jaskinia pustelnika
        </h1>
        <div className="dd__dialogue__turn__prompt dd-tp__formatted-text">
          <div className="dd__dialogue__turn__actor">{this.state.actor}</div>
          <ReactMarkdown source={this.state.prompt} />
        </div>
        {answers.isEmpty() ? (
          <button
            className="dd__button dd__button--dialogue-turn-end"
            onClick={this.onDialogueEndClick}
          >
            Zakończ dialog
          </button>
        ) : (
          <ol className="dd__dialogue__turn__answers">
            {answers
              .toSet()
              .toArray()
              .map(dialogueMessage => (
                <li
                  className="dd__dialogue__turn__answer"
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
