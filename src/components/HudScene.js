// @flow

import * as React from "react";

import HudSceneOverlay from "./HudSceneOverlay";
import SceneCanvas from "../framework/classes/HTMLElement/SceneCanvas";
import useHTMLCustomElement from "../effects/useHTMLCustomElement";
import useSceneCanvas from "../effects/useSceneCanvas";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoadingManager } from "../framework/interfaces/LoadingManager";
import type { Logger } from "../framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  isDocumentHidden: boolean,
  loadingManager: LoadingManager,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
|};

export default React.memo<Props>(function HudScene(props: Props) {
  const [sceneCanvas, setSceneCanvas] = React.useState<?SceneCanvas>(null);
  const isSceneCanvasDefined = useHTMLCustomElement("x-dm-scene-canvas", SceneCanvas);

  const castSceneCanvas = React.useCallback(
    function(element: ?HTMLElement) {
      if (!element) {
        return void setSceneCanvas(null);
      }

      // This type of casting is a workaround to make flow typed
      // hints work. For some reason it asserts that SceneCanvas is not
      // compatible with HTMLElement.
      setSceneCanvas(((element: any): SceneCanvas));
    },
    [setSceneCanvas]
  );

  useSceneCanvas(props.debug, props.exceptionHandler, props.loadingManager, props.logger, props.loggerBreadcrumbs, props.queryBus, sceneCanvas);

  return (
    <div className="dd__scene dd__scene--canvas dd__scene--hud">
      {isSceneCanvasDefined && <x-dm-scene-canvas class="dd__scene__canvas" documenthidden={String(props.isDocumentHidden)} ref={castSceneCanvas} />}
      <HudSceneOverlay loadingManager={props.loadingManager} />
    </div>
  );
});
