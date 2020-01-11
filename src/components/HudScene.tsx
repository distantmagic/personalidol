import * as React from "react";

import HudSceneOverlay from "./HudSceneOverlay";
import SceneCanvas from "../framework/classes/HTMLElement/SceneCanvas";
import useHTMLCustomElement from "../effects/useHTMLCustomElement";
import useSceneCanvas from "../effects/useSceneCanvas";

import { Debugger } from "../framework/interfaces/Debugger";
import { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import { LoadingManager } from "../framework/interfaces/LoadingManager";
import { Logger } from "../framework/interfaces/Logger";
import { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import { QueryBus } from "../framework/interfaces/QueryBus";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "x-dm-scene-canvas": any;
    }
  }
}

type Props = {
  debug: Debugger;
  exceptionHandler: ExceptionHandler;
  isDocumentHidden: boolean;
  loadingManager: LoadingManager;
  logger: Logger;
  loggerBreadcrumbs: LoggerBreadcrumbs;
  queryBus: QueryBus;
};

export default React.memo<Props>(function HudScene(props: Props) {
  const [sceneCanvas, setSceneCanvas] = React.useState<null | SceneCanvas>(null);
  const isSceneCanvasDefined = useHTMLCustomElement("x-dm-scene-canvas", SceneCanvas);

  React.useEffect(
    function() {
      if (!sceneCanvas) {
        return;
      }

      function onContextMenu(evt: MouseEvent) {
        evt.preventDefault();

        return false;
      }

      sceneCanvas.addEventListener("contextmenu", onContextMenu);
    },
    [sceneCanvas]
  );

  useSceneCanvas(props.debug, props.exceptionHandler, props.loadingManager, props.logger, props.loggerBreadcrumbs, props.queryBus, sceneCanvas);

  return (
    <div className="dd__scene dd__scene--canvas dd__scene--hud">
      <HudSceneOverlay loadingManager={props.loadingManager} />
      {isSceneCanvasDefined && <x-dm-scene-canvas class="dd__scene__canvas" documenthidden={String(props.isDocumentHidden)} ref={setSceneCanvas} />}
    </div>
  );
});
