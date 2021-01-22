import { MathUtils } from "three/src/math/MathUtils";

import { mountMount } from "@personalidol/framework/src/mountMount";
import { mountUnmount } from "@personalidol/framework/src/mountUnmount";

import type { Logger } from "loglevel";
import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { Director as IDirector } from "./Director.interface";
import type { SceneTransition as ISceneTransition } from "./SceneTransition.interface";
import type { SceneTransitionState } from "./SceneTransitionState.type";

export function SceneTransition(logger: Logger, renderer: WebGLRenderer, sceneDirector: IDirector, loadingScreenDirector: IDirector): ISceneTransition {
  const state: SceneTransitionState = Object.seal({
    lastUpdateCurrentTick: -1,
    lastUpdateNextTick: -1,
    lastUpdateTransitioningTick: -1,
  });

  function start(): void {}

  function stop(): void {}

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    const scene = sceneDirector.state.current;
    const loadingScreen = loadingScreenDirector.state.current;

    state.lastUpdateCurrentTick = Math.max(sceneDirector.state.lastUpdateCurrentTick, loadingScreenDirector.state.lastUpdateCurrentTick);
    state.lastUpdateNextTick = Math.max(sceneDirector.state.lastUpdateNextTick, loadingScreenDirector.state.lastUpdateNextTick);
    state.lastUpdateTransitioningTick = Math.max(sceneDirector.state.lastUpdateTransitioningTick, loadingScreenDirector.state.lastUpdateTransitioningTick);

    if (scene) {
      if (loadingScreen) {
        if (loadingScreen.state.isMounted) {
          mountUnmount(logger, loadingScreen);
        }

        renderer.clear();
      }

      if (!scene.state.isMounted) {
        mountMount(logger, scene);
      }

      scene.update(delta, elapsedTime, tickTimerState);

      return;
    }

    if (!loadingScreen) {
      return;
    }

    if (!loadingScreen.state.isMounted) {
      mountMount(logger, loadingScreen);
    }

    loadingScreen.update(delta, elapsedTime, tickTimerState);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "SceneTransition",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
