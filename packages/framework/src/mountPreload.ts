import type { Logger } from "loglevel";

import type { Mount } from "./Mount.interface";

export function mountPreload(logger: Logger, mount: Mount): void {
  if (mount.state.isPreloaded) {
    throw new Error(`Mount is already preloaded: "${mount.name}"`);
  }

  if (mount.state.isPreloading) {
    throw new Error(`Mount is already preloading: "${mount.name}"`);
  }

  logger.info(`PRELOAD_MOUNT(${mount.name})`);

  mount.preload();

  if (!mount.state.isPreloading && !mount.state.isPreloaded) {
    throw new Error(`Mount needs to go into 'preloading' state immediately after calling '.preload' method or be preloaded immediately: "${mount.name}"`);
  }

  if (mount.state.isPreloaded && mount.state.isPreloading) {
    throw new Error(`Mount can't be both preloaded and preloading at the same time: "${mount.name}"`);
  }
}
