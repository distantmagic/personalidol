// @flow

import * as React from "react";

import HudSceneCanvas from "./HudSceneCanvas";
// import HudSceneLocationRoom from "./HudSceneLocationRoom";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { KeyboardState } from "../framework/interfaces/KeyboardState";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";
import type { Scheduler } from "../framework/interfaces/Scheduler";

type Props = {|
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  keyboardState: KeyboardState,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
  scheduler: Scheduler
|};

export default React.memo<Props>(function HudScene(props: Props) {
  return (
    <HudSceneCanvas
      debug={props.debug}
      exceptionHandler={props.exceptionHandler}
      keyboardState={props.keyboardState}
      loggerBreadcrumbs={props.loggerBreadcrumbs}
      queryBus={props.queryBus}
      scheduler={props.scheduler}
    />
  );
});
