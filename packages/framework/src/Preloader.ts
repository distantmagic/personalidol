import { MathUtils } from "three/src/math/MathUtils";

import { preload as fPreload } from "./preload";

import type { Logger } from "loglevel";

import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { Preloadable } from "./Preloadable.interface";
import type { Preloader as IPreloader } from "./Preloader.interface";

export function Preloader(logger: Logger): IPreloader {
  const preloadables: Set<Preloadable> = new Set();
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  const _waiting: Set<Function> = new Set();

  let _isAnyPreloading: boolean = false;

  function _notify(): void {
    for (let waiting of _waiting) {
      _waiting.delete(waiting);
      waiting();
    }
  }

  function update(): void {
    _isAnyPreloading = false;

    for (let preloadable of preloadables) {
      if (!preloadable.state.isPreloading && !preloadable.state.isPreloaded) {
        fPreload(logger, preloadable);
      }
      if (preloadable.state.isPreloading) {
        _isAnyPreloading = true;
      }
    }

    if (_isAnyPreloading) {
      return;
    }

    _notify();
    preloadables.clear();
  }

  function wait(): Promise<void> {
    return new Promise(function (resolve) {
      _waiting.add(resolve);
    });
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: `Preloader`,
    preloadables: preloadables,
    state: state,

    update: update,
    wait: wait,
  });
}
