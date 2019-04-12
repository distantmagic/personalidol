// @flow

import * as React from "react";

import HudSceneCanvas from "./HudSceneCanvas";
// import HudSceneLocationRoom from "./HudSceneLocationRoom";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { FPSAdaptive } from "../framework/interfaces/FPSAdaptive";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { MainLoop } from "../framework/interfaces/MainLoop";

type Props = {|
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  fpsAdaptive: FPSAdaptive,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  mainLoop: MainLoop
|};

export default React.memo<Props>(function HudScene(props: Props) {
  return (
    <HudSceneCanvas
      debug={props.debug}
      exceptionHandler={props.exceptionHandler}
      fpsAdaptive={props.fpsAdaptive}
      loggerBreadcrumbs={props.loggerBreadcrumbs}
      mainLoop={props.mainLoop}
    />
  );
});
