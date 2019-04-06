// @flow

import * as React from "react";
import * as THREE from "three";

import CanvasLocationComplex from "../controllers/CanvasLocationComplex";
import HudSceneCanvas from "./HudSceneCanvas";
// import HudSceneLocationRoom from "./HudSceneLocationRoom";
import ResourceLoadError from "../framework/classes/Exception/ResourceLoadError";
import ResourcesLoadingState from "../framework/classes/ResourcesLoadingState";
import SceneManager from "../framework/classes/SceneManager";

import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { MainLoop } from "../framework/interfaces/MainLoop";
import type { ResourcesLoadingState as ResourcesLoadingStateInterface } from "../framework/interfaces/ResourcesLoadingState";
import type { SceneManager as SceneManagerInterface } from "../framework/interfaces/SceneManager";

type Props = {|
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  mainLoop: MainLoop
|};

export default function HudScene(props: Props) {
  const [
    resourcesLoadingState,
    setLoadingState
  ] = React.useState<ResourcesLoadingStateInterface>(
    new ResourcesLoadingState(0, 0)
  );
  const [
    sceneManager,
    setSceneManager
  ] = React.useState<?SceneManagerInterface>(null);
  const [threeLoadingManager] = React.useState<THREE.LoadingManager>(
    new THREE.LoadingManager()
  );

  React.useEffect(
    function() {
      setSceneManager(
        new SceneManager(
          props.mainLoop,
          new CanvasLocationComplex(threeLoadingManager)
        )
      );
    },
    [props.mainLoop, threeLoadingManager]
  );

  React.useEffect(
    function() {
      // keep the old reference
      const manager = threeLoadingManager;
      let globalItemsLoaded = 0;
      let globalItemsTotal = 0;
      let error = null;

      manager.onStart = function(url, itemsLoaded, itemsTotal) {
        setLoadingState(
          new ResourcesLoadingState(itemsLoaded, itemsTotal, error)
        );
      };

      manager.onProgress = function(url, itemsLoaded, itemsTotal) {
        globalItemsLoaded = itemsLoaded;
        globalItemsTotal = itemsTotal;

        setLoadingState(
          new ResourcesLoadingState(itemsLoaded, itemsTotal, error)
        );
      };

      manager.onError = function(url: string) {
        error = new ResourceLoadError(url);
        props.exceptionHandler.captureException(
          props.loggerBreadcrumbs.add("threeLoadingManager.onError"),
          error
        );

        setLoadingState(
          new ResourcesLoadingState(globalItemsLoaded, globalItemsTotal, error)
        );
      };

      return function() {
        delete manager.onError;
        delete manager.onProgress;
        delete manager.onStart;
      };
    },
    [threeLoadingManager]
  );

  // return (
  //   <HudSceneLocationRoom />
  // );

  if (!sceneManager) {
    return (
      <div className="dd__scene dd__scene--hud dd__scene--canvas">
        <div className="dd__loader dd__scene__loader">
          Initializing scene...
        </div>
      </div>
    );
  }

  return (
    <HudSceneCanvas
      resourcesLoadingState={resourcesLoadingState}
      sceneManager={sceneManager}
    />
  );
}
