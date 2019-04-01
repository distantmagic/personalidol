// @flow

import * as React from "react";
import ReactMarkdown from "react-markdown";

import DialogueAnswer from "./DialogueAnswer";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
import type { DialogueMessages } from "../framework/types/DialogueMessages";
import type { Logger } from "../framework/interfaces/Logger";

type Props = {|
  actor: string,
  answers: DialogueMessages,
  illustration: ?string,
  logger: Logger,
  onAnswerClick: DialogueMessage => any,
  onDialogueEnd: () => any,
  prompt: string
|};

export default React.memo<Props>(function(props: Props) {
  function onDialogueEndClick(evt: SyntheticEvent<any>): void {
    evt.preventDefault();

    props.onDialogueEnd();
  }

  return (
    <div className="dd__dialogue__turn">
      {props.illustration && (
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
        <div className="dd__dialogue__turn__actor">{props.actor}</div>
        <ReactMarkdown source={props.prompt} />
      </div>
      <hr className="dd__dialogue__hr" />
      {props.answers.isEmpty() ? (
        <button
          className="dd__button dd__button--dialogue-turn-end"
          onClick={onDialogueEndClick}
        >
          Zakończ dialog
        </button>
      ) : (
        <ol className="dd__dialogue__turn__answers">
          {props.answers
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
});
