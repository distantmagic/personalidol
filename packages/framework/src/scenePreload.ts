import type { Logger } from "loglevel";

import type { Scene } from "./Scene.interface";

export function scenePreload(logger: Logger, scene: Scene): void {
  if (scene.state.isPreloaded) {
    throw new Error(`Scene is already preloaded: "${scene.name}"`);
  }

  if (scene.state.isPreloading) {
    throw new Error(`Scene is already preloading: "${scene.name}"`);
  }

  logger.debug("PRELOAD SCENE", scene.name);

  scene.preload();
}
