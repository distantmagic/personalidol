import type { Logger } from "loglevel";

import type { Mount } from "./Mount.interface";

export function mountUnmount(logger: Logger, mount: Mount): void {
  if (!mount.state.isMounted) {
    throw new Error(`Mount is already unmounted: "${mount.name}"`);
  }

  logger.info(`UNMOUNT_MOUNT(${mount.name})`);
  mount.unmount();

  if (mount.state.isMounted) {
    throw new Error(`Mount must go into 'unmounted' state immediately after calling '.unmount': "${mount.name}"`);
  }
}
