import { mountMountSoft } from "@personalidol/framework/src/mountMountSoft";
import { mountUnmountSoft } from "@personalidol/framework/src/mountUnmountSoft";

import type { Logger } from "loglevel";
import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import type { Director as IDirector } from "./Director.interface";
import type { SceneTransition as ISceneTransition } from "./SceneTransition.interface";

export function SceneTransition(logger: Logger, renderer: WebGLRenderer, sceneDirector: IDirector, loadingScreenDirector: IDirector): ISceneTransition {
  function start(): void {}

  function stop(): void {}

  function update(delta: number, elapsedTime: number): void {
    const scene = sceneDirector.state.current;
    const loadingScreen = loadingScreenDirector.state.current;

    if (scene) {
      if (loadingScreen) {
        mountUnmountSoft(logger, loadingScreen);
        renderer.clear();
      }

      mountMountSoft(logger, scene);
      scene.update(delta, elapsedTime);

      return;
    }

    if (!loadingScreen) {
      return;
    }

    mountMountSoft(logger, loadingScreen);
    loadingScreen.update(delta, elapsedTime);
  }

  return Object.freeze({
    name: "SceneTransition",

    start: start,
    stop: stop,
    update: update,
  });
}
