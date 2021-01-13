import { mountUnmount } from "./mountUnmount";

import type { Logger } from "loglevel";

import type { Mountable } from "./Mountable.interface";

export function mountUnmountSoft(logger: Logger, mount: Mountable): void {
  if (mount.state.isMounted) {
    mountUnmount(logger, mount);
  }
}
