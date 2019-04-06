// @flow

import * as React from "react";
import * as THREE from "three";

import CanvasLocationComplex from "../controllers/CanvasLocationComplex";
import HudSceneManager from "./HudSceneManager";
// import HudSceneLocationRoom from "./HudSceneLocationRoom";
import ResourcesLoadingState from "../framework/classes/ResourcesLoadingState";
import SceneManager from "../framework/classes/SceneManager";

import type { MainLoop } from "../framework/interfaces/MainLoop";
import type { ResourcesLoadingState as ResourcesLoadingStateInterface } from "../framework/interfaces/ResourcesLoadingState";
import type { SceneManager as SceneManagerInterface } from "../framework/interfaces/SceneManager";

type Props = {|
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

      manager.onStart = function(url, itemsLoaded, itemsTotal) {
        setLoadingState(
          resourcesLoadingState.setProgress(itemsLoaded, itemsTotal)
        );
      };

      manager.onProgress = function(url, itemsLoaded, itemsTotal) {
        setLoadingState(
          resourcesLoadingState.setProgress(itemsLoaded, itemsTotal)
        );
      };

      manager.onError = function(url: string) {
        console.log("There was an error loading " + url);
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
    <HudSceneManager
      resourcesLoadingState={resourcesLoadingState}
      sceneManager={sceneManager}
    />
  );
}
