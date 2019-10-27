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
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
|};

export default function HudScene(props: Props) {
  const [customElements] = React.useState<?CustomElementRegistry>(window.customElements);
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
      customElements.define('x-dm-scene-canvas', SceneCanvas);
    }
  }, [customElements]);

  React.useEffect(function () {
    if (!sceneCanvas) {
      return;
    }

    const breadcrumbs = props.loggerBreadcrumbs.add("useEffect(SceneCanvas)");
    const cancelToken = new CancelToken(breadcrumbs.add("CancelToken"));

    sceneCanvas.addEventListener('resourcesLoadingStateChange', function (evt: Event) {
      if (evt instanceof CustomEvent) {
        setResourcesLoadingState(evt.detail);
      }
    });

    sceneCanvas.attach(
      cancelToken,
      props.debug,
      props.exceptionHandler,
      props.loggerBreadcrumbs,
      props.queryBus,
    );

    return function () {
      cancelToken.cancel(props.loggerBreadcrumbs.add("(cleanup)"));
      sceneCanvas.detach();
    };
  }, [
    props.debug,
    props.exceptionHandler,
    props.loggerBreadcrumbs,
    props.queryBus,
    sceneCanvas,
  ]);

  if (customElements) {
    return (
      <div className="dd__scene dd__scene--canvas dd__scene--hud">
        <HudSceneOverlayError>
          :(
          https://caniuse.com/#search=customelements
        </HudSceneOverlayError>
      </div>
    );
  }

  return (
    <div className="dd__scene dd__scene--canvas dd__scene--hud">
      <HudSceneOverlay resourcesLoadingState={resourcesLoadingState} />
      <x-dm-scene-canvas
        class="dd__scene__canvas"
        ref={castSceneCanvas}
      />
    </div>
  );
}
