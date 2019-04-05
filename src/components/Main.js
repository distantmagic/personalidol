// @flow

import * as React from "react";
import classnames from "classnames";

import BusClock from "../framework/classes/BusClock";
import CancelToken from "../framework/classes/CancelToken";
import DialogueLoader from "./DialogueLoader";
import DialogueResourceReference from "../framework/classes/ResourceReference/Dialogue";
import ExpressionBus from "../framework/classes/ExpressionBus";
import ExpressionContext from "../framework/classes/ExpressionContext";
import HudAside from "./HudAside";
import HudModalRouter from "./HudModalRouter";
import HudScene from "./HudScene";
import HudToolbar from "./HudToolbar";
import MainLoop from "../framework/classes/MainLoop";
import Person from "../framework/classes/Entity/Person";
import QueryBus from "../framework/classes/QueryBus";
import QueryBusController from "../framework/classes/QueryBusController";

import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { Logger } from "../framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
// import type { QueryBus as QueryBusInterface } from "../framework/interfaces/QueryBus";

type Props = {|
  exceptionHandler: ExceptionHandler,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbs
|};

export default function Main(props: Props) {
  const [expressionBus] = React.useState(new ExpressionBus());
  const [expressionContext] = React.useState(new ExpressionContext());
  const [isDocumentHidden, setIsDocumentHidden] = React.useState(
    document.hidden
  );
  const [mainLoop] = React.useState(MainLoop.getInstance());
  const [queryBus] = React.useState(new QueryBus());
  const [queryBusController] = React.useState(
    new QueryBusController(new BusClock(), queryBus)
  );

  React.useEffect(
    function() {
      function onHiddenChange() {
        setIsDocumentHidden(document.hidden);
      }

      document.addEventListener("visibilitychange", onHiddenChange);

      return function() {
        document.removeEventListener("visibilitychange", onHiddenChange);
      };
    },
    [isDocumentHidden]
  );

  React.useEffect(
    function() {
      if (isDocumentHidden) {
        mainLoop.stop();
      } else {
        mainLoop.start();
      }
    },
    [isDocumentHidden, mainLoop]
  );

  React.useEffect(
    function() {
      const cancelToken = new CancelToken();

      queryBusController.interval(cancelToken);

      return function() {
        cancelToken.cancel();
      };
    },
    [queryBusController]
  );

  return (
    <div className={classnames("dd__container", "dd__hud")}>
      <HudAside />
      <DialogueLoader
        dialogueResourceReference={
          new DialogueResourceReference("/data/dialogues/hermit-intro.yml")
        }
        dialogueInitiator={new Person("Laelaps")}
        exceptionHandler={props.exceptionHandler}
        expressionBus={expressionBus}
        expressionContext={expressionContext}
        logger={props.logger}
        loggerBreadcrumbs={props.loggerBreadcrumbs.add("DialogueLoader")}
        queryBus={queryBus}
      />
      <HudScene mainLoop={mainLoop} />
      <div className="dd__frame dd__statusbar dd__statusbar--hud">
        Thalantyr: szansa na zadanie obrażeń 56%. Intuicja podpowiada ci, że
        będzie przyjaźnie nastawiony.
      </div>
      <HudToolbar />
      <HudModalRouter
        exceptionHandler={props.exceptionHandler}
        logger={props.logger}
        loggerBreadcrumbs={props.loggerBreadcrumbs.add("HudModalRouter")}
        queryBus={queryBus}
      />
    </div>
  );
}
