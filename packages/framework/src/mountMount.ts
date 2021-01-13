import type { Logger } from "loglevel";

import type { Mount } from "./Mount.interface";

export function mountMount(logger: Logger, mount: Mount): void {
  if (mount.state.isMounted) {
    throw new Error(`Mount is already mounted: "${mount.name}"`);
  }

  logger.info(`MOUNT_MOUNT(${mount.name})`);
  mount.mount();

  if (!mount.state.isMounted) {
    throw new Error(`Mount needs to go into 'mounted' state immediately after calling '.mount' method: "${mount.name}"`);
  }
}
