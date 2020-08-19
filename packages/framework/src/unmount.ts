import { invoke } from "./invoke";

import type { Unmountable } from "./Unmountable.type";

export function unmount(unmountables: Set<Unmountable>): void {
  unmountables.forEach(invoke);
  unmountables.clear();
}
