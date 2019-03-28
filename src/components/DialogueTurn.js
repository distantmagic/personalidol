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
  const [state, setState] = React.useState({
    actor: null,
    answers: Map(),
    illustration: null,
    isLoading: true,
    prompt: null
  });

  function onDialogueEndClick(evt: SyntheticEvent<any>): void {
    evt.preventDefault();

    props.onDialogueEnd();
  }

  React.useEffect(
    function() {
      Promise.all([
        props.dialogueTurn.actor(),
        props.dialogueTurn.answers(),
        props.dialogueTurn.getIllustration(),
        props.dialogueTurn.prompt()
      ])
        .then(([actor, answers, illustration, prompt]) => {
          setState({
            actor: actor,
            answers: answers,
            illustration: illustration,
            isLoading: false,
            prompt: prompt
          });
        })
        .catch(props.logger.error);
    },
    [props.dialogueTurn]
  );

  if (state.isLoading) {
    return <DialogueSpinner />;
  }

  return (
    <div className="dd__dialogue__turn">
      {state.illustration && (
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
        <div className="dd__dialogue__turn__actor">{state.actor}</div>
        <ReactMarkdown source={state.prompt} />
      </div>
      <hr className="dd__dialogue__hr" />
      {state.answers.isEmpty() ? (
        <button
          className="dd__button dd__button--dialogue-turn-end"
          onClick={onDialogueEndClick}
        >
          Zakończ dialog
        </button>
      ) : (
        <ol className="dd__dialogue__turn__answers">
          {state.answers
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
