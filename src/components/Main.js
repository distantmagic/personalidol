// @flow

import * as React from "react";
import classnames from "classnames";

import CancelToken from "../framework/classes/CancelToken";
import DialogueLoader from "./DialogueLoader";
import HudAside from "./HudAside";
import HudDebuggerListing from "./HudDebuggerListing";
import HudModalRouter from "./HudModalRouter";
import HudScene from "./HudScene";
import HudSettings from "./HudSettings";
import Person from "../framework/classes/Entity/Person";

import type { ClockReactiveController } from "../framework/interfaces/ClockReactiveController";
import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { ExpressionBus } from "../framework/interfaces/ExpressionBus";
import type { ExpressionContext } from "../framework/interfaces/ExpressionContext";
import type { LoadingManager } from "../framework/interfaces/LoadingManager";
import type { Logger } from "../framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  clockReactiveController: ClockReactiveController,
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
  loadingManager: LoadingManager,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
|};

function checkIsDocumentTooSmall(innerHeight: number, innerWidth: number): bool {
  return innerHeight < 600 || innerWidth < 600;
}

export default function Main(props: Props) {
  const [dialogueInitiator] = React.useState(new Person("Laelaps"));
  const [dialogueResourceReference] = React.useState("/data/dialogues/hermit-intro.yml");
  const [isDocumentHidden, setIsDocumentHidden] = React.useState<boolean>(document.hidden);
  const [isDocumentTooSmall, setIsDocumentTooSmall] = React.useState<boolean>(checkIsDocumentTooSmall(window.innerHeight, window.innerWidth));

  const hasDialogue = false;

  React.useEffect(function () {
    function onResize(): void {
      setIsDocumentTooSmall(checkIsDocumentTooSmall(window.innerHeight, window.innerWidth));
    }

    const intervalId = setInterval(onResize);

    return function () {
      clearInterval(intervalId);
    };
  });

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

  if (isDocumentTooSmall) {
    return (
      <strong>
        Your resolution is too low.
      </strong>
    );
  }

  return (
    <div
      className={classnames("dd__container", "dd__hud", {
        "dd__hud--debugger": props.debug.isEnabled(),
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
      <HudDebuggerListing debug={props.debug} />
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
        loadingManager={props.loadingManager}
        loggerBreadcrumbs={props.loggerBreadcrumbs.add("HudScene")}
        queryBus={props.queryBus}
      />
      <HudSettings />
    </div>
  );
}
