import { mountUnmount } from "./mountUnmount";

import type { Logger } from "loglevel";

import type { Mount } from "./Mount.interface";

export function mountUnmountSoft(logger: Logger, mount: Mount): void {
  if (mount.state.isMounted) {
    mountUnmount(logger, mount);
  }
}
