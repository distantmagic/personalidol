// @flow

import { Map } from "immutable";

import * as React from "react";
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

export default function DialogueTurn(props: Props) {
  const [actor, setActor] = React.useState(null);
  const [answers, setAnswers] = React.useState(Map());
  const [illustration, setIllustration] = React.useState(null);
  const [prompt, setPrompt] = React.useState(null);

  function onDialogueEndClick(evt: SyntheticEvent<any>): void {
    evt.preventDefault();

    props.onDialogueEnd();
  }

  React.useEffect(
    function() {
      props.dialogueTurn
        .actor()
        .then(setActor)
        .catch(props.logger.error);
      props.dialogueTurn
        .answers()
        .then(setAnswers)
        .catch(props.logger.error);
      props.dialogueTurn
        .getIllustration()
        .then(setIllustration)
        .catch(props.logger.error);
      props.dialogueTurn
        .prompt()
        .then(setPrompt)
        .catch(props.logger.error);
    },
    [props.dialogueTurn]
  );

  if (!answers) {
    return <DialogueSpinner />;
  }

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
      <h1 className="dd__dialogue__turn__title">Jaskinia pustelnika</h1>
      <div className="dd__dialogue__turn__prompt dd-tp__formatted-text">
        <div className="dd__dialogue__turn__actor">{actor}</div>
        <ReactMarkdown source={prompt} />
      </div>
      <hr className="dd__dialogue__hr" />
      {answers.isEmpty() ? (
        <button
          className="dd__button dd__button--dialogue-turn-end"
          onClick={onDialogueEndClick}
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
                  logger={props.logger}
                  onAnswerClick={props.onAnswerClick}
                />
              </li>
            ))}
        </ol>
      )}
    </div>
  );
}
