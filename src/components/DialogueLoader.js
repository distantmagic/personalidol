// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import Dialogue from "./Dialogue";
import DialogueQuery from "../framework/classes/Query/Dialogue";
import DialogueSpinner from "./DialogueSpinner";
// import { default as DialogueClass } from "../framework/classes/Dialogue";

import type { ExpressionBus } from "../framework/interfaces/ExpressionBus";
import type { ExpressionContext } from "../framework/interfaces/ExpressionContext";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { Identifiable } from "../framework/interfaces/Identifiable";
import type { Logger } from "../framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";
import type { Speaks } from "../framework/interfaces/Sentient/Speaks";

type Props = {|
  dialogueInitiator: Identifiable & Speaks,
  dialogueResourceReference: string,
  exceptionHandler: ExceptionHandler,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus
|};

export default React.memo<Props>(function DialogueLoader(props: Props) {
  const [dialogue, setDialogue] = React.useState(null);
  const [isDialogueEnded, setIsDialogueEnded] = React.useState<boolean>(false);

  React.useEffect(
    function() {
      const cancelToken = new CancelToken();
      const query = new DialogueQuery(
        props.expressionBus,
        props.expressionContext,
        props.dialogueResourceReference
      );

      props.queryBus
        .enqueue(cancelToken, query)
        .then(setDialogue)
        .catch((error: Error) => {
          return props.exceptionHandler.captureException(
            props.loggerBreadcrumbs.add("dialogueQuery"),
            error
          );
        });

      return function() {
        cancelToken.cancel();
      };
    },
    [
      props.dialogueResourceReference,
      props.expressionBus,
      props.expressionContext
    ]
  );

  if (!dialogue) {
    return <DialogueSpinner label="Loading dialogue..." />;
  }

  if (isDialogueEnded) {
    return (
      <div className="dd__dialogue dd__dialogue--hud dd__frame">
        <div className="dd__dialogue__end">Koniec dialogu.</div>
      </div>
    );
  }

  return (
    <Dialogue
      dialogue={dialogue}
      dialogueInitiator={props.dialogueInitiator}
      exceptionHandler={props.exceptionHandler}
      onDialogueEnd={setIsDialogueEnded}
      logger={props.logger}
      loggerBreadcrumbs={props.loggerBreadcrumbs.add("Dialogue")}
    />
  );
});
