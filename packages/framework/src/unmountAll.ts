import { invoke } from "./invoke";

import type { UnmountableCallback } from "./UnmountableCallback.type";

export function unmountAll(unmountables: Set<UnmountableCallback>): void {
  unmountables.forEach(invoke);
  unmountables.clear();
}
