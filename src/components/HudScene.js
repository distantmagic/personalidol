// @flow

import * as React from "react";
import * as THREE from "three";

import CancelToken from "../framework/classes/CancelToken";
import HudSceneOverlay from "./HudSceneOverlay";
import HudSceneOverlayError from "./HudSceneOverlayError";
import SceneCanvas from "../framework/classes/HTMLElement/SceneCanvas";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoadingManager } from "../framework/interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  isDocumentHidden: boolean,
  loadingManager: LoadingManager,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
|};

export default React.memo<Props>(function HudScene(props: Props) {
  const [customElements] = React.useState<?CustomElementRegistry>(window.customElements);
  const [isSceneCanvasDefined, setIsSceneCanvasDefined] = React.useState<boolean>(false);
  const [sceneCanvas, setSceneCanvas] = React.useState<?SceneCanvas>(null);

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

  React.useEffect(
    function() {
      if (customElements) {
        customElements.whenDefined("x-dm-scene-canvas").then(function() {
          setIsSceneCanvasDefined(true);
        });
        if (!customElements.get("x-dm-scene-canvas")) {
          customElements.define("x-dm-scene-canvas", SceneCanvas);
        }
      }
    },
    [customElements]
  );

  React.useEffect(
    function() {
      if (!sceneCanvas) {
        return;
      }

      const breadcrumbs = props.loggerBreadcrumbs.add("useEffect(SceneCanvas)");
      const cancelToken = new CancelToken(breadcrumbs.add("CancelToken"));
      const threeLoadingManager = new THREE.LoadingManager();

      function beforeUnload() {
        cancelToken.cancel(breadcrumbs.add("beforeunload"));
      }

      window.addEventListener("beforeunload", beforeUnload, {
        once: true,
      });
      sceneCanvas.attachRenderer(cancelToken, props.debug, props.exceptionHandler, props.loadingManager, props.queryBus, threeLoadingManager);

      return function() {
        window.removeEventListener("beforeunload", beforeUnload);
        cancelToken.cancel(breadcrumbs.add("cleanup"));
      };
    },
    [props.debug, props.exceptionHandler, props.loadingManager, props.loggerBreadcrumbs, props.queryBus, sceneCanvas]
  );

  if (!customElements) {
    return (
      <div className="dd__scene dd__scene--canvas dd__scene--hud">
        <HudSceneOverlayError>
          <strong class="dd__loader__error-message">Your browser can't render game scene because it does not support customElements technical feature.</strong>
          <a href="https://caniuse.com/#search=customelements">Which browsers support customElements?</a>
        </HudSceneOverlayError>
      </div>
    );
  }

  return (
    <div className="dd__scene dd__scene--canvas dd__scene--hud">
      {isSceneCanvasDefined && <x-dm-scene-canvas class="dd__scene__canvas" documenthidden={String(props.isDocumentHidden)} ref={castSceneCanvas} />}
      <HudSceneOverlay loadingManager={props.loadingManager} />
    </div>
  );
});
