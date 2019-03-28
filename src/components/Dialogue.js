// @flow

import * as React from "react";

import DialogueSpinner from "./DialogueSpinner";
import { default as DialogueClass } from "../framework/classes/Dialogue";
import { default as DialogueTurnComponent } from "./DialogueTurn";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
// import type { DialogueTurn } from "../framework/interfaces/DialogueTurn";
import type { Identifiable } from "../framework/interfaces/Identifiable";
import type { Logger } from "../framework/interfaces/Logger";
import type { Speaks } from "../framework/interfaces/Sentient/Speaks";

type Props = {|
  dialogue: DialogueClass,
  dialogueInitiator: Identifiable & Speaks,
  logger: Logger,
  onDialogueEnd: () => any
|};

export default function Dialogue(props: Props) {
  const [dialogueTurn, setDialogueTurn] = React.useState(null);

  async function onAnswerClick(message: DialogueMessage): Promise<void> {
    if (!dialogueTurn) {
      return;
    }

    const nextDialogueTurn = await dialogueTurn.answer(message);

    if (nextDialogueTurn) {
      setDialogueTurn(nextDialogueTurn);
    } else {
      setDialogueTurn(null);
      props.onDialogueEnd();
    }
  }

  React.useEffect(
    function() {
      props.dialogue
        .initiate(props.dialogueInitiator)
        .then(setDialogueTurn)
        .catch(props.logger.error);
    },
    [props.dialogue, props.dialogueInitiator]
  );

  if (!dialogueTurn) {
    return <DialogueSpinner />;
  }

  return (
    <DialogueTurnComponent
      dialogueTurn={dialogueTurn}
      logger={props.logger}
      onAnswerClick={onAnswerClick}
      onDialogueEnd={props.onDialogueEnd}
    />
  );
}
