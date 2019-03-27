// @flow

import * as React from "react";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
import type { Logger } from "../framework/interfaces/Logger";

type Props = {|
  dialogueMessage: DialogueMessage,
  logger: Logger,
  onAnswerClick: DialogueMessage => any
|};

export default function DialogueAnswer(props: Props) {
  const [ actor, setActor ] = React.useState(null);
  const [ prompt, setPrompt ] = React.useState(null);

  React.useEffect(function () {
    props.dialogueMessage.actor().then(setActor).catch(props.logger.error);
    props.dialogueMessage.prompt().then(setPrompt).catch(props.logger.error);

    return function () {
      setActor(null);
      setPrompt(null);
    };
  }, [ props.dialogueMessage ]);

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
