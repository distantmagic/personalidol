// @flow

import * as React from "react";
import * as THREE from "three";

import CancelToken from "../framework/classes/CancelToken";
import SceneCanvas from "../framework/classes/HTMLElement/SceneCanvas";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoadingManager } from "../framework/interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";

export default function useSceneCanvas(
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  loadingManager: LoadingManager,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
  sceneCanvas: ?SceneCanvas
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
      sceneCanvas.attachRenderer(cancelToken, debug, exceptionHandler, loadingManager, queryBus, threeLoadingManager);

      return function() {
        window.removeEventListener("beforeunload", beforeUnload);
        cancelToken.cancel(breadcrumbs.add("cleanup"));
      };
    },
    [debug, exceptionHandler, loadingManager, loggerBreadcrumbs, queryBus, sceneCanvas]
  );
}
