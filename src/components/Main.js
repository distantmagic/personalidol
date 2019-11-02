// @flow

import * as React from "react";
import classnames from "classnames";

import CancelToken from "../framework/classes/CancelToken";
import DialogueLoader from "./DialogueLoader";
import HudAside from "./HudAside";
import HudDebuggerListing from "./HudDebuggerListing";
import HudModalRouter from "./HudModalRouter";
import HudScene from "./HudScene";
import Person from "../framework/classes/Entity/Person";

import type { ClockReactiveController } from "../framework/interfaces/ClockReactiveController";
import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { ExpressionBus } from "../framework/interfaces/ExpressionBus";
import type { ExpressionContext } from "../framework/interfaces/ExpressionContext";
import type { Logger } from "../framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  clockReactiveController: ClockReactiveController,
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
  const [isDocumentHidden, setIsDocumentHidden] = React.useState<boolean>(document.hidden);

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

  React.useEffect(
    function() {
      document.addEventListener(
        "visibilitychange",
        function(): void {
          setIsDocumentHidden(document.hidden);
        },
        {
          once: true,
        }
      );
    },
    [isDocumentHidden]
  );

  React.useEffect(
    function() {
      if (isDocumentHidden) {
        return;
      }

      const breadcrumbs = props.loggerBreadcrumbs.add("useEffect(isDocumentHidden)");
      const cancelToken = new CancelToken(breadcrumbs.add("CancelToken"));

      props.clockReactiveController.interval(cancelToken);

      return function() {
        cancelToken.cancel(breadcrumbs.add("cleanup"));
      };
    },
    [isDocumentHidden, props.clockReactiveController, props.loggerBreadcrumbs]
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
        <HudModalRouter
          exceptionHandler={props.exceptionHandler}
          logger={props.logger}
          loggerBreadcrumbs={props.loggerBreadcrumbs.add("HudModalRouter")}
          queryBus={props.queryBus}
        />
        <HudScene
          debug={props.debug}
          exceptionHandler={props.exceptionHandler}
          isDocumentHidden={isDocumentHidden}
          loggerBreadcrumbs={props.loggerBreadcrumbs.add("HudScene")}
          queryBus={props.queryBus}
        />
      </div>
    </React.Fragment>
  );
}
