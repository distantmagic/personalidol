import { mountMount } from "./mountMount";

import type { Logger } from "loglevel";

import type { Mount } from "./Mount.interface";

export function mountMountSoft(logger: Logger, mount: Mount): boolean {
  if (mount.state.isMounted) {
    return false;
  }

  mountMount(logger, mount);

  return true;
}
