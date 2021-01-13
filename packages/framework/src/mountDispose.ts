import { mountUnmountSoft } from "./mountUnmountSoft";

import type { Logger } from "loglevel";

import type { Mount } from "./Mount.interface";

export function mountDispose(logger: Logger, mount: Mount): void {
  if (mount.state.isDisposed) {
    throw new Error(`Mount is already disposed: "${mount.name}"`);
  }

  mountUnmountSoft(logger, mount);

  logger.info(`DISPOSE_MOUNT(${mount.name})`);
  mount.dispose();

  if (!mount.state.isDisposed) {
    throw new Error(`Mount needs to be disposed immediately after calling 'dispose' method and it's not: "${mount.name}"`);
  }
}
