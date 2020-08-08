import type { Logger } from "loglevel";

import type { Scene } from "./Scene.interface";

export function sceneMountSoft(logger: Logger, scene: Scene): boolean {
  if (scene.state.isMounted) {
    return false;
  }

  logger.debug("MOUNT SCENE", scene.name);
  scene.mount();

  return true;
}
