import { isPromise } from "./isPromise";
import { name } from "./name";

import type { Logger } from "loglevel";

import type { Preloadable } from "./Preloadable.interface";

function _validateResolvedPreload(logger: Logger, mount: Preloadable, value: any) {
  if ("undefined" !== typeof value) {
    throw new Error("`preload` method cannot return anything.");
  }

  if (!mount.state.isPreloading && mount.state.isPreloaded) {
    return;
  }

  throw new Error(`After resolving 'preload' method, mount must be in preloaded state: "${name(mount)}"`);
}

export function preload(logger: Logger, mount: Preloadable): void | Promise<void> {
  if (mount.state.isPreloaded) {
    throw new Error(`Mount is already preloaded: "${name(mount)}"`);
  }

  if (mount.state.isPreloading) {
    throw new Error(`Mount is already preloading: "${name(mount)}"`);
  }

  logger.info(`PRELOAD(${name(mount)})`);

  const ret = mount.preload();

  if (!mount.state.isPreloading && !mount.state.isPreloaded) {
    throw new Error(`Mount needs to go into 'preloading' state immediately after calling '.preload' method or be preloaded immediately instead: "${name(mount)}"`);
  }

  if (mount.state.isPreloaded && mount.state.isPreloading) {
    throw new Error(`Mount can't be both preloaded and preloading at the same time: "${name(mount)}"`);
  }

  if (isPromise(ret)) {
    return ret.then(function (value: any) {
      return _validateResolvedPreload(logger, mount, value);
    });
  }

  return ret;
}
