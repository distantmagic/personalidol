// @flow

import * as React from "react";
import classnames from "classnames";

import DialogueLoader from "./DialogueLoader";
import HudAside from "./HudAside";
import HudDebuggerListing from "./HudDebuggerListing";
import HudScene from "./HudScene";
import HudSettings from "./HudSettings";
import HudToolbar from "./HudToolbar";
import ModalRouter from "./ModalRouter";
import Person from "../framework/classes/Entity/Person";
import Preloader from "./Preloader";
import useClockReactiveController from "../effects/useClockReactiveController";
import useIsDocumentHidden from "../effects/useIsDocumentHidden";

import type { ClockReactiveController } from "../framework/interfaces/ClockReactiveController";
import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { ExpressionBus } from "../framework/interfaces/ExpressionBus";
import type { ExpressionContext } from "../framework/interfaces/ExpressionContext";
import type { LoadingManager } from "../framework/interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  clockReactiveController: ClockReactiveController,
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
  loadingManager: LoadingManager,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
|};

export default function Main(props: Props) {
  const [dialogueInitiator] = React.useState(new Person("Laelaps"));
  const [dialogueResourceReference] = React.useState("/data/dialogues/hermit-intro.yml");
  const [isPreloaded, setIsPreloaded] = React.useState<boolean>(Preloader.isLoaded());

  const hasDialogue = false;
  const isDocumentHidden = useIsDocumentHidden();

  useClockReactiveController(props.clockReactiveController, isDocumentHidden, props.loggerBreadcrumbs);

  if (!isPreloaded) {
    return <Preloader onPreloaded={setIsPreloaded} />;
  }

  return (
    <React.Fragment>
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
            loggerBreadcrumbs={props.loggerBreadcrumbs.add("DialogueLoader")}
            queryBus={props.queryBus}
          />
        )}
        <HudAside />
        <HudDebuggerListing debug={props.debug} />
        <HudScene
          debug={props.debug}
          exceptionHandler={props.exceptionHandler}
          isDocumentHidden={isDocumentHidden}
          loadingManager={props.loadingManager}
          loggerBreadcrumbs={props.loggerBreadcrumbs.add("HudScene")}
          queryBus={props.queryBus}
        />
        <HudSettings />
        <HudToolbar />
      </div>
      <ModalRouter exceptionHandler={props.exceptionHandler} loggerBreadcrumbs={props.loggerBreadcrumbs.add("ModalRouter")} queryBus={props.queryBus} />
    </React.Fragment>
  );
}
