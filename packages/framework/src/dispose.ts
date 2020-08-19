import { invoke } from "./invoke";

import type { Disposable } from "./Disposable.type";

export function dispose(disposables: Set<Disposable>): void {
  disposables.forEach(invoke);
  disposables.clear();
}
