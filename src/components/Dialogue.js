// @flow

import * as React from "react";

import DialogueSpinner from "./DialogueSpinner";
import { default as DialogueClass } from "../framework/classes/Dialogue";
import { default as DialogueTurnComponent } from "./DialogueTurn";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
import type { DialogueTurn } from "../framework/interfaces/DialogueTurn";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { Identifiable } from "../framework/interfaces/Identifiable";
import type { Logger } from "../framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { Speaks } from "../framework/interfaces/Sentient/Speaks";

type Props = {|
  dialogue: DialogueClass,
  dialogueInitiator: Identifiable & Speaks,
  exceptionHandler: ExceptionHandler,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  onDialogueEnd: boolean => any
|};

export default function Dialogue(props: Props) {
  const [dialogueTurn, setDialogueTurn] = React.useState<?DialogueTurn>(null);

  async function onAnswerClick(message: DialogueMessage): Promise<void> {
    if (!dialogueTurn) {
      return;
    }

    const nextDialogueTurn = await dialogueTurn.answer(message);

    if (nextDialogueTurn) {
      setDialogueTurn(nextDialogueTurn);
    } else {
      setDialogueTurn(null);
      props.onDialogueEnd(true);
    }
  }

  React.useEffect(
    function() {
      props.dialogue
        .initiate(props.dialogueInitiator)
        .then(setDialogueTurn)
        .catch((error: Error) => {
          return props.exceptionHandler.captureException(
            props.loggerBreadcrumbs.add("initiateDialogue"),
            error
          );
        });
    },
    [
      props.dialogue,
      props.dialogueInitiator,
      props.exceptionHandler,
      props.loggerBreadcrumbs
    ]
  );

  if (!dialogueTurn) {
    return <DialogueSpinner label="Loading dialogue turn..." />;
  }

  return (
    <DialogueTurnComponent
      dialogueTurn={dialogueTurn}
      exceptionHandler={props.exceptionHandler}
      logger={props.logger}
      loggerBreadcrumbs={props.loggerBreadcrumbs.add("DialogueTurnComponent")}
      onAnswerClick={onAnswerClick}
      onDialogueEnd={props.onDialogueEnd}
    />
  );
}
