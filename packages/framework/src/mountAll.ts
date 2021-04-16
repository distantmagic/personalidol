import { invoke } from "./invoke";

import type { MountableCallback } from "./MountableCallback.type";

export function mountAll(mountables: Set<MountableCallback>): void {
  mountables.forEach(invoke);
  mountables.clear();
}
