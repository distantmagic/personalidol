// @flow

import * as React from "react";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";

type Props = {|
  dialogueMessage: DialogueMessage,
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  onAnswerClick: DialogueMessage => void,
|};

export default function DialogueAnswer(props: Props) {
  const [actor, setActor] = React.useState<?string>(null);
  const [prompt, setPrompt] = React.useState<?string>(null);

  React.useEffect(
    function() {
      props.dialogueMessage.actor().then(setActor);
      props.dialogueMessage.prompt().then(setPrompt);
    },
    [props.dialogueMessage, props.exceptionHandler, props.loggerBreadcrumbs]
  );

  function onAnswerClick(evt: SyntheticEvent<HTMLElement>): void {
    evt.preventDefault();

    props.onAnswerClick(props.dialogueMessage);
  }

  return (
    <button className="dd__dialogue__turn__answer__button" onClick={onAnswerClick}>
      {actor} - {prompt}
    </button>
  );
}
