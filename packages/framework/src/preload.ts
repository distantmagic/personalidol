import { name } from "./name";

import type { Logger } from "loglevel";

import type { Mountable } from "./Mountable.interface";

export function preload(logger: Logger, mount: Mountable): void {
  if (mount.state.isPreloaded) {
    throw new Error(`Mount is already preloaded: "${name(mount)}"`);
  }

  if (mount.state.isPreloading) {
    throw new Error(`Mount is already preloading: "${name(mount)}"`);
  }

  logger.info(`PRELOAD(${name(mount)})`);

  mount.preload();

  if (!mount.state.isPreloading && !mount.state.isPreloaded) {
    throw new Error(`Mount needs to go into 'preloading' state immediately after calling '.preload' method or be preloaded immediately instead: "${name(mount)}"`);
  }

  if (mount.state.isPreloaded && mount.state.isPreloading) {
    throw new Error(`Mount can't be both preloaded and preloading at the same time: "${name(mount)}"`);
  }
}
