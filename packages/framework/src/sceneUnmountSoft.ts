import type { Logger } from "loglevel";

import type { Scene } from "./Scene.interface";

export function sceneUnmountSoft(logger: Logger, scene: Scene): void {
  if (scene.state.isMounted) {
    logger.debug(`UNMOUNT_SCENE(${scene.name})`);
    scene.unmount();
  }
}
