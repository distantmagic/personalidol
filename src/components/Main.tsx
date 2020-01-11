import * as React from "react";
import classnames from "classnames";

import HudAside from "./HudAside";
import HudDebuggerListing from "./HudDebuggerListing";
import HudScene from "./HudScene";
import HudSettings from "./HudSettings";
import ModalRouter from "./ModalRouter";
import useClockReactiveController from "../effects/useClockReactiveController";
import useIsDocumentHidden from "../effects/useIsDocumentHidden";

import "../scss/index.scss";

import { ClockReactiveController } from "../framework/interfaces/ClockReactiveController";
import { Debugger } from "../framework/interfaces/Debugger";
import { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import { LoadingManager } from "../framework/interfaces/LoadingManager";
import { Logger } from "../framework/interfaces/Logger";
import { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {
  clockReactiveController: ClockReactiveController;
  debug: Debugger;
  exceptionHandler: ExceptionHandler;
  loadingManager: LoadingManager;
  logger: Logger;
  loggerBreadcrumbs: LoggerBreadcrumbs;
  queryBus: QueryBus;
};

export default function Main(props: Props) {
  const hasDialogue = false;
  const isDocumentHidden = useIsDocumentHidden();

  useClockReactiveController(props.clockReactiveController, isDocumentHidden, props.loggerBreadcrumbs);

  return (
    <React.Fragment>
      <div
        className={classnames("dd__container", "dd__hud", {
          "dd__hud--debugger": props.debug.isEnabled(),
          "dd__hud--dialogue": hasDialogue,
        })}
      >
        <HudAside />
        <HudDebuggerListing debug={props.debug} />
        <HudScene
          debug={props.debug}
          exceptionHandler={props.exceptionHandler}
          isDocumentHidden={isDocumentHidden}
          loadingManager={props.loadingManager}
          logger={props.logger}
          loggerBreadcrumbs={props.loggerBreadcrumbs.add("HudScene")}
          queryBus={props.queryBus}
        />
        <HudSettings />
      </div>
      <ModalRouter exceptionHandler={props.exceptionHandler} loggerBreadcrumbs={props.loggerBreadcrumbs.add("ModalRouter")} queryBus={props.queryBus} />
    </React.Fragment>
  );
}
