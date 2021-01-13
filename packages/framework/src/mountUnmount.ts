import { name } from "./name";

import type { Logger } from "loglevel";

import type { Mountable } from "./Mountable.interface";

export function mountUnmount(logger: Logger, mount: Mountable): void {
  if (!mount.state.isMounted) {
    throw new Error(`Mount is already unmounted: "${name(mount)}"`);
  }

  logger.info(`UNMOUNT(${name(mount)})`);
  mount.unmount();

  if (mount.state.isMounted) {
    throw new Error(`Mount must go into 'unmounted' state immediately after calling '.unmount': "${name(mount)}"`);
  }
}
