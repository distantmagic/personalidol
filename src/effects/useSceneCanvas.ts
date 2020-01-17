import * as React from "react";
import * as THREE from "three";

import CancelToken from "src/framework/classes/CancelToken";
import SceneCanvas from "src/framework/classes/HTMLElement/SceneCanvas";

import Debugger from "src/framework/interfaces/Debugger";
import ExceptionHandler from "src/framework/interfaces/ExceptionHandler";
import LoadingManager from "src/framework/interfaces/LoadingManager";
import Logger from "src/framework/interfaces/Logger";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import QueryBus from "src/framework/interfaces/QueryBus";

export default function useSceneCanvas(
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  loadingManager: LoadingManager,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
  sceneCanvas: null | SceneCanvas
): void {
  React.useEffect(
    function() {
      if (!sceneCanvas) {
        return;
      }

      const breadcrumbs = loggerBreadcrumbs.add("useEffect(SceneCanvas)");
      const cancelToken = new CancelToken(breadcrumbs.add("CancelToken"));
      const threeLoadingManager = new THREE.LoadingManager();

      function beforeUnload() {
        cancelToken.cancel(breadcrumbs.add("beforeunload"));
      }

      window.addEventListener("beforeunload", beforeUnload, {
        once: true,
      });
      sceneCanvas.attachRenderer(cancelToken, debug, exceptionHandler, loadingManager, logger, queryBus, threeLoadingManager);

      return function() {
        window.removeEventListener("beforeunload", beforeUnload);
        cancelToken.cancel(breadcrumbs.add("cleanup"));
      };
    },
    [debug, exceptionHandler, loadingManager, logger, loggerBreadcrumbs, queryBus, sceneCanvas]
  );
}
