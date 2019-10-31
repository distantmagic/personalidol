// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import HudSceneOverlay from "./HudSceneOverlay";
import HudSceneOverlayError from "./HudSceneOverlayError";
import SceneCanvas from "../framework/classes/HTMLElement/SceneCanvas";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";
import type { ResourcesLoadingState } from "../framework/interfaces/ResourcesLoadingState";

type Props = {|
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  isDocumentHidden: boolean,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
|};

export default function HudScene(props: Props) {
  const [customElements] = React.useState<?CustomElementRegistry>(window.customElements);
  const [isSceneCanvasDefined, setIsSceneCanvasDefined] = React.useState<bool>(false);
  const [resourcesLoadingState, setResourcesLoadingState] = React.useState<?ResourcesLoadingState>(null);
  const [sceneCanvas, setSceneCanvas] = React.useState<?SceneCanvas>(null);

  const castSceneCanvas = React.useCallback(function (element: ?HTMLElement) {
    if (!element) {
      return void setSceneCanvas(null);
    }

    // This type of casting is a workaround to make flow typed
    // hints work. For some reason it asserts that SceneCanvas is not
    // compatible with HTMLElement.
    setSceneCanvas(((element: any): SceneCanvas));
  }, [setSceneCanvas]);

  React.useEffect(function () {
    if (customElements) {
      customElements.whenDefined('x-dm-scene-canvas').then(function () {
        setIsSceneCanvasDefined(true);
      });
      customElements.define('x-dm-scene-canvas', SceneCanvas);
    }
  }, [customElements]);

  React.useEffect(function () {
    if (!sceneCanvas) {
      return;
    }

    const breadcrumbs = props.loggerBreadcrumbs.add("useEffect(SceneCanvas)");
    const cancelToken = new CancelToken(breadcrumbs.add("CancelToken"));

    sceneCanvas.startPainting(
      cancelToken,
      props.debug,
      props.exceptionHandler,
      props.loggerBreadcrumbs.add("sceneCanvas").add("startPainting"),
      props.queryBus,
    );

    return function () {
      cancelToken.cancel(props.loggerBreadcrumbs.add("cleanup"));
    };
  }, [
    props.debug,
    props.exceptionHandler,
    props.loggerBreadcrumbs,
    props.queryBus,
    sceneCanvas,
  ]);

  if (!customElements) {
    return (
      <div className="dd__scene dd__scene--canvas dd__scene--hud">
        <HudSceneOverlayError>
          <strong class="dd__loader__error-message">
            Your browser can't render game scene because it does not
            support customElements technical feature.
          </strong>
          <a href="https://caniuse.com/#search=customelements">
            Which browsers support customElements?
          </a>
        </HudSceneOverlayError>
      </div>
    );
  }

  return (
    <div className="dd__scene dd__scene--canvas dd__scene--hud">
      <HudSceneOverlay resourcesLoadingState={resourcesLoadingState} />
      {isSceneCanvasDefined && (
        <x-dm-scene-canvas
          class="dd__scene__canvas"
          documenthidden={String(props.isDocumentHidden)}
          ref={castSceneCanvas}
        />
      )}
    </div>
  );
}
