import { MathUtils } from "three/src/math/MathUtils";

import { isViewBagScene } from "./isViewBagScene";

import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { Scene } from "@personalidol/framework/src/Scene.interface";

import type { DirectorState } from "./DirectorState.type";
import type { ViewBagScene } from "./ViewBagScene.interface";
import type { ViewBagSceneObserver as IViewBagSceneObserver } from "./ViewBagSceneObserver.interface";

/**
 * `ViewBagScene` needs a push to poll the state of underlying scene and
 * viewbag. This service observes them and updates them and thanks to that
 * there is no need to add `ViewBagScene` to the main loop or add some code to
 * mitigate that in every place `ViewBagScene` is used.
 */
export function ViewBagSceneObserver(directorState: DirectorState): IViewBagSceneObserver {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  function start() {}

  function stop() {}

  function update() {
    const transitioningScene: null | Scene | ViewBagScene = directorState.transitioning;

    if (!transitioningScene) {
      return;
    }

    if (!isViewBagScene(transitioningScene)) {
      return;
    }

    if (transitioningScene.state.isPreloading) {
      // Polling for updates is necessary only when a scene is actually
      // preloading.
      transitioningScene.updatePreloadingState();
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "ViewBagSceneObserver",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
