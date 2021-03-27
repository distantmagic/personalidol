import { isMountable } from "./isMountable";
import { name } from "./name";

import type { Logger } from "loglevel";

import type { Disposable } from "./Disposable.interface";

export function dispose(logger: Logger, disposable: Disposable): void {
  if (disposable.state.isDisposed) {
    throw new Error(`Mount point is already disposed: "${name(disposable)}"`);
  }

  if (isMountable(disposable) && disposable.state.isMounted) {
    throw new Error(`Mount point needs to be unmounted before disposing: "${name(disposable)}"`);
  }

  logger.debug(`DISPOSE(${name(disposable)})`);
  disposable.dispose();

  if (!disposable.state.isDisposed) {
    throw new Error(`Mount point needs to be disposed immediately after calling 'dispose' method and it's not: "${name(disposable)}"`);
  }
}
