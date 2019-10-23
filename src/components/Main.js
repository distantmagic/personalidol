// @flow

import * as React from "react";
import classnames from "classnames";

import DialogueLoader from "./DialogueLoader";
import HudAside from "./HudAside";
import HudDebuggerListing from "./HudDebuggerListing";
import HudModalRouter from "./HudModalRouter";
import HudScene from "./HudScene";
import Person from "../framework/classes/Entity/Person";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { ExpressionBus } from "../framework/interfaces/ExpressionBus";
import type { ExpressionContext } from "../framework/interfaces/ExpressionContext";
import type { Logger } from "../framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { Scheduler } from "../framework/interfaces/Scheduler";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
|};

export default function Main(props: Props) {
  const [dialogueInitiator] = React.useState(new Person("Laelaps"));
  const [dialogueResourceReference] = React.useState("/data/dialogues/hermit-intro.yml");
  const [debuggerState, setDebuggetState] = React.useState(props.debug.getState());

  const hasDebugger = !debuggerState.isEmpty();
  const hasDialogue = false;

  React.useEffect(
    function() {
      const debug = props.debug;

      debug.onStateChange(setDebuggetState);

      return function() {
        debug.offStateChange(setDebuggetState);
      };
    },
    [props.debug]
  );

  return (
    <React.Fragment>
      <div
        className={classnames("dd__container", "dd__hud", {
          "dd__hud--debugger": hasDebugger,
          "dd__hud--dialogue": hasDialogue,
        })}
      >
        {hasDialogue && (
          <DialogueLoader
            dialogueResourceReference={dialogueResourceReference}
            dialogueInitiator={dialogueInitiator}
            exceptionHandler={props.exceptionHandler}
            expressionBus={props.expressionBus}
            expressionContext={props.expressionContext}
            logger={props.logger}
            loggerBreadcrumbs={props.loggerBreadcrumbs.add("DialogueLoader")}
            queryBus={props.queryBus}
          />
        )}
        <HudAside />
        {hasDebugger && <HudDebuggerListing debuggerState={debuggerState} />}
        <HudScene
          debug={props.debug}
          exceptionHandler={props.exceptionHandler}
          loggerBreadcrumbs={props.loggerBreadcrumbs.add("HudScene")}
          queryBus={props.queryBus}
        />
        <HudModalRouter
          exceptionHandler={props.exceptionHandler}
          logger={props.logger}
          loggerBreadcrumbs={props.loggerBreadcrumbs.add("HudModalRouter")}
          queryBus={props.queryBus}
        />
      </div>
    </React.Fragment>
  );
}
