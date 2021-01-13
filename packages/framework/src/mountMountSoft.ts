import { mountMount } from "./mountMount";

import type { Logger } from "loglevel";

import type { Mountable } from "./Mountable.interface";

export function mountMountSoft(logger: Logger, mount: Mountable): boolean {
  if (mount.state.isMounted) {
    return false;
  }

  mountMount(logger, mount);

  return true;
}
