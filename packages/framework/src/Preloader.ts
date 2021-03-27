import { preload } from "./preload";

import type { Logger } from "loglevel";

import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { Preloadable } from "./Preloadable.interface";
import type { Preloader as IPreloader } from "./Preloader.interface";

export function Preloader(logger: Logger, preloadable: Preloadable): IPreloader {
  const callbacks: Set<Function> = new Set();
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  function _notify(resolve: Function): void {
    resolve();
  }

  function _onPreloaded(): void {
    state.needsUpdates = false;
    callbacks.forEach(_notify);
  }

  function update(): void {
    if (!preloadable.state.isPreloaded) {
      return;
    }

    _onPreloaded();
  }

  function wait(): Promise<void> {
    preload(logger, preloadable);

    if (preloadable.state.isPreloaded) {
      _onPreloaded();

      return Promise.resolve(void 0);
    }

    return new Promise(function (resolve, reject) {
      callbacks.add(resolve);
    });
  }

  return Object.freeze({
    isPreloader: true,
    state: state,

    update: update,
    wait: wait,
  });
}
