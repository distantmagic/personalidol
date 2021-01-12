import { invoke } from "./invoke";

import type { Mountable } from "./Mountable.type";

export function mount(mountables: Set<Mountable>): void {
  mountables.forEach(invoke);
  mountables.clear();
}
