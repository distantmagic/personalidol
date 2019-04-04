// @flow

import * as React from "react";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { Logger } from "../framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";

type Props = {|
  dialogueMessage: DialogueMessage,
  exceptionHandler: ExceptionHandler,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  onAnswerClick: DialogueMessage => any
|};

export default function DialogueAnswer(props: Props) {
  const [actor, setActor] = React.useState(null);
  const [prompt, setPrompt] = React.useState(null);

  React.useEffect(
    function() {
      props.dialogueMessage
        .actor()
        .then(setActor)
        .catch((error: Error) => {
          return props.exceptionHandler.captureException(
            props.loggerBreadcrumbs.add("dialogueMessageActor"),
            error
          );
        });
      props.dialogueMessage
        .prompt()
        .then(setPrompt)
        .catch((error: Error) => {
          return props.exceptionHandler.captureException(
            props.loggerBreadcrumbs.add("dialogueMessagePrompt"),
            error
          );
        });
    },
    [props.dialogueMessage]
  );

  function onAnswerClick(evt: SyntheticEvent<any>): void {
    evt.preventDefault();

    props.onAnswerClick(props.dialogueMessage);
  }

  return (
    <button
      className="dd__dialogue__turn__answer__button"
      onClick={onAnswerClick}
    >
      {actor} - {prompt}
    </button>
  );
}
