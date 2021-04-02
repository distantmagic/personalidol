import { isPromise } from "./isPromise";
import { name } from "./name";

import type { Logger } from "loglevel";

import type { Preloadable } from "./Preloadable.interface";

export function preload(logger: Logger, mount: Preloadable, isExpectedToBePreloaded: boolean = true, isAcceptingPromise: boolean = false): void | Promise<void> {
  if (mount.state.isPreloaded) {
    throw new Error(`Mount is already preloaded: "${name(mount)}"`);
  }

  if (mount.state.isPreloading) {
    throw new Error(`Mount is already preloading: "${name(mount)}"`);
  }

  logger.debug(`PRELOAD(${name(mount)})`);

  const ret = mount.preload();

  if (!mount.state.isPreloading && !mount.state.isPreloaded) {
    throw new Error(`Mount needs to go into 'preloading' state immediately after calling '.preload' method or be preloaded immediately instead: "${name(mount)}"`);
  }

  if (mount.state.isPreloaded && mount.state.isPreloading) {
    throw new Error(`Mount can't be both preloaded and preloading at the same time: "${name(mount)}"`);
  }

  if (!isPromise(ret)) {
    if (isExpectedToBePreloaded && (!mount.state.isPreloaded || mount.state.isPreloading)) {
      throw new Error(`Mount is expected to be preloaded immediately: "${name(mount)}"`);
    }

    return;
  }

  if (!isAcceptingPromise) {
    throw new Error(`Mount was not expected to use a promise during preloading: "${name(mount)}"`);
  }

  return ret.then(function () {
    if (!mount.state.isPreloaded || mount.state.isPreloading) {
      throw new Error(`Mount must be in preloaded state after resolving "preload": "${name(mount)}"`);
    }
  });
}
