// @flow

import * as React from "react";
import Image from "react-image";
import ReactMarkdown from "react-markdown";

import DialogueAnswer from "./DialogueAnswer";

import imgImageManuscriptHeader from "../assets/image-manuscript-header.png";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
import type { DialogueMessages } from "../framework/types/DialogueMessages";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { Logger } from "../framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";

type Props = {|
  actor: string,
  answers: DialogueMessages,
  exceptionHandler: ExceptionHandler,
  illustration: ?string,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  onAnswerClick: DialogueMessage => any,
  onDialogueEnd: boolean => any,
  prompt: string,
|};

export default React.memo<Props>(function DialogueTurnPrompt(props: Props) {
  function onDialogueEndClick(evt: SyntheticEvent<any>): void {
    evt.preventDefault();

    props.onDialogueEnd(true);
  }

  return (
    <div className="dd__dialogue__turn">
      {props.illustration && (
        <div className="dd__dialogue__turn__illustration">
          <Image
            alt="Illustration"
            className="dd__dialogue__turn__illustration__image"
            src={imgImageManuscriptHeader}
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
        <button className="dd__button dd__button--dialogue-turn-end" onClick={onDialogueEndClick}>
          Zakończ dialog
        </button>
      ) : (
        <ol className="dd__dialogue__turn__answers">
          {props.answers
            .toSet()
            .toArray()
            .map(dialogueMessage => (
              <li className="dd__dialogue__turn__answer" key={dialogueMessage.key()}>
                <DialogueAnswer
                  dialogueMessage={dialogueMessage}
                  exceptionHandler={props.exceptionHandler}
                  logger={props.logger}
                  loggerBreadcrumbs={props.loggerBreadcrumbs.add("DialogueAnswer")}
                  onAnswerClick={props.onAnswerClick}
                />
              </li>
            ))}
        </ol>
      )}
    </div>
  );
});
