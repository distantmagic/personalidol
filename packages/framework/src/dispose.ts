import { invoke } from "./invoke";

import type { DisposableCallback } from "./DisposableCallback.type";

export function dispose(disposables: Set<DisposableCallback>): void {
  disposables.forEach(invoke);
  disposables.clear();
}
