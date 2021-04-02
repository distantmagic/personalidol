import { invoke } from "./invoke";

import type { GenericCallback } from "./GenericCallback.type";

export function flush(callbacks: Set<GenericCallback>): void {
  callbacks.forEach(invoke);
  callbacks.clear();
}
