import { MathUtils } from "three/src/math/MathUtils";

import { mountMountSoft } from "@personalidol/framework/src/mountMountSoft";

import type { Logger } from "loglevel";

import type { Director as IDirector } from "./Director.interface";
import type { SceneLoader as ISceneLoader } from "./SceneLoader.interface";

export function SceneLoader(logger: Logger, sceneDirector: IDirector): ISceneLoader {
  function start(): void {}

  function stop(): void {}

  function update(delta: number, elapsedTime: number): void {
    const scene = sceneDirector.state.current;

    if (scene) {
      mountMountSoft(logger, scene);
      scene.update(delta, elapsedTime);
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "SceneLoader",

    start: start,
    stop: stop,
    update: update,
  });
}
