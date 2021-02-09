import { name } from "./name";

import type { Logger } from "loglevel";

import type { Mountable } from "./Mountable.interface";

export function mount(logger: Logger, mount: Mountable): void {
  if (mount.state.isMounted) {
    throw new Error(`Mount is already mounted: "${name(mount)}"`);
  }

  logger.info(`MOUNT(${name(mount)})`);
  mount.mount();

  if (!mount.state.isMounted) {
    throw new Error(`Mount needs to go into 'mounted' state immediately after calling '.mount' method: "${name(mount)}"`);
  }
}
