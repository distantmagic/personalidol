import { mountUnmountSoft } from "./mountUnmountSoft";
import { name } from "./name";

import type { Logger } from "loglevel";

import type { Mountable } from "./Mountable.interface";

export function mountDispose(logger: Logger, mount: Mountable): void {
  if (mount.state.isDisposed) {
    throw new Error(`Mount point is already disposed: "${name(mount)}"`);
  }

  mountUnmountSoft(logger, mount);

  logger.info(`DISPOSE(${name(mount)})`);
  mount.dispose();

  if (!mount.state.isDisposed) {
    throw new Error(`Mount point needs to be disposed immediately after calling 'dispose' method and it's not: "${name(mount)}"`);
  }
}
