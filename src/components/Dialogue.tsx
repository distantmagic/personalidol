import * as React from "react";

import DialogueSpinner from "./DialogueSpinner";
import { default as DialogueClass } from "../framework/classes/Dialogue";
import { default as DialogueTurnComponent } from "./DialogueTurn";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
import type { DialogueTurn } from "../framework/interfaces/DialogueTurn";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { Identifiable } from "../framework/interfaces/Identifiable";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { Speaks } from "../framework/interfaces/Sentient/Speaks";

type Props = {|
  dialogue: DialogueClass,
  dialogueInitiator: Identifiable & Speaks,
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  onDialogueEnd: boolean => void,
|};

export default React.memo<Props>(function Dialogue(props: Props) {
  const [dialogueTurn, setDialogueTurn] = React.useState<?DialogueTurn>(null);

  const onAnswerClick = React.useCallback(
    function(message: DialogueMessage): void {
      if (!dialogueTurn) {
        return;
      }

      dialogueTurn.answer(message).then(function(nextDialogueTurn) {
        if (nextDialogueTurn) {
          setDialogueTurn(nextDialogueTurn);
        } else {
          setDialogueTurn(null);
          props.onDialogueEnd(true);
        }
      });
    },
    [dialogueTurn, props]
  );

  React.useEffect(
    function() {
      props.dialogue.initiate(props.dialogueInitiator).then(setDialogueTurn);
    },
    [props.dialogue, props.dialogueInitiator, props.exceptionHandler, props.loggerBreadcrumbs]
  );

  if (!dialogueTurn) {
    return <DialogueSpinner label="Loading dialogue turn..." />;
  }

  return (
    <DialogueTurnComponent
      dialogueTurn={dialogueTurn}
      exceptionHandler={props.exceptionHandler}
      loggerBreadcrumbs={props.loggerBreadcrumbs.add("DialogueTurnComponent")}
      onAnswerClick={onAnswerClick}
      onDialogueEnd={props.onDialogueEnd}
    />
  );
});
