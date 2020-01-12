import * as React from "react";
import classnames from "classnames";

import HudAside from "src/components/HudAside";
import HudDebuggerListing from "src/components/HudDebuggerListing";
import HudScene from "src/components/HudScene";
import HudSettings from "src/components/HudSettings";
import ModalRouter from "src/components/ModalRouter";
import useClockReactiveController from "src/effects/useClockReactiveController";
import useIsDocumentHidden from "src/effects/useIsDocumentHidden";

import "src/scss/index.scss";

import { ClockReactiveController } from "src/framework/interfaces/ClockReactiveController";
import { Debugger } from "src/framework/interfaces/Debugger";
import { ExceptionHandler } from "src/framework/interfaces/ExceptionHandler";
import { LoadingManager } from "src/framework/interfaces/LoadingManager";
import { Logger } from "src/framework/interfaces/Logger";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { QueryBus } from "src/framework/interfaces/QueryBus";

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
