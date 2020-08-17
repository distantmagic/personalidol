import { sceneUnmountSoft } from "./sceneUnmountSoft";

import type { Logger } from "loglevel";

import type { Scene } from "./Scene.interface";

export function sceneDispose(logger: Logger, scene: Scene): void {
  if (scene.state.isDisposed) {
    throw new Error(`Scene is already disposed: "${scene.name}"`);
  }

  sceneUnmountSoft(logger, scene);

  logger.debug(`DISPOSE_SCENE(${scene.name})`);
  scene.dispose();
}
