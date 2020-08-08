import { sceneMountSoft } from "./sceneMountSoft";
import { sceneUnmountSoft } from "./sceneUnmountSoft";

import type { Logger } from "loglevel";

import type { Director as IDirector } from "./Director.interface";
import type { RendererState } from "./RendererState.type";
import type { SceneLoader as ISceneLoader } from "./SceneLoader.interface";

export function SceneLoader(logger: Logger, rendererState: RendererState, sceneDirector: IDirector, loadingScreenDirector: IDirector): ISceneLoader {
  function start(): void {}

  function stop(): void {}

  function update(delta: number, elapsedTime: number): void {
    const scene = sceneDirector.state.current;
    const loadingScreen = loadingScreenDirector.state.current;

    if (scene) {
      if (loadingScreen) {
        sceneUnmountSoft(logger, loadingScreen);
      }

      sceneMountSoft(logger, scene);
      scene.update(delta, elapsedTime);

      return;
    }

    if (!loadingScreen) {
      return;
    }

    sceneMountSoft(logger, loadingScreen);
    loadingScreen.update(delta, elapsedTime);
  }

  return {
    start: start,
    stop: stop,
    update: update,
  };
}
