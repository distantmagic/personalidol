// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import Dialogue from "./Dialogue";
import DialogueQuery from "../framework/classes/Query/Dialogue";
import DialogueResourceReference from "../framework/classes/ResourceReference/Dialogue";
import DialogueSpinner from "./DialogueSpinner";
// import { default as DialogueClass } from "../framework/classes/Dialogue";

import type { ExpressionBus } from "../framework/interfaces/ExpressionBus";
import type { ExpressionContext } from "../framework/interfaces/ExpressionContext";
import type { Identifiable } from "../framework/interfaces/Identifiable";
import type { Logger } from "../framework/interfaces/Logger";
import type { QueryBus } from "../framework/interfaces/QueryBus";
import type { Speaks } from "../framework/interfaces/Sentient/Speaks";

type Props = {|
  dialogueInitiator: Identifiable & Speaks,
  dialogueResourceReference: DialogueResourceReference,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
  logger: Logger,
  queryBus: QueryBus
|};

export default function DialogueLoader(props: Props) {
  const [ cancelToken ] = React.useState(new CancelToken());
  const [ dialogue, setDialogue ] = React.useState(null);
  const [ isDialogueEnded, setIsDialogueEnded ] = React.useState(false);

  React.useEffect(function () {
    const query = new DialogueQuery(
      props.expressionBus,
      props.expressionContext,
      props.dialogueResourceReference
    );

    props.queryBus
      .enqueue(cancelToken, query)
      .then(setDialogue)
      .catch(props.logger.error)
    ;

    return function () {
      cancelToken.cancel();

      setDialogue(null);
      setIsDialogueEnded(false);
    };
  }, [ cancelToken, cancelToken.isCancelled(), props.dialogueResourceReference ]);

  if (!dialogue) {
    return (
      <div className="dd__dialogue dd__dialogue--hud dd__frame">
        <DialogueSpinner />
      </div>
    );
  }

  if (isDialogueEnded) {
    return (
      <div className="dd__dialogue dd__dialogue--hud dd__frame">
        <div className="dd__dialogue__end">Koniec dialogu.</div>
      </div>
    );
  }

  return (
    <div className="dd__dialogue dd__dialogue--hud dd__frame">
      <Dialogue
        dialogue={dialogue}
        dialogueInitiator={props.dialogueInitiator}
        onDialogueEnd={setIsDialogueEnded}
        logger={props.logger}
      />
    </div>
  );
}
