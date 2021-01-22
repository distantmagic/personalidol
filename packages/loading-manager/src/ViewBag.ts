import { MathUtils } from "three/src/math/MathUtils";

import { mountDispose } from "@personalidol/framework/src/mountDispose";
import { mountMount } from "@personalidol/framework/src/mountMount";
import { mountPreload } from "@personalidol/framework/src/mountPreload";
import { mountUnmount } from "@personalidol/framework/src/mountUnmount";

import type { Logger } from "loglevel";

import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { View } from "@personalidol/framework/src/View.interface";

import type { ViewBag as IViewBag } from "./ViewBag.interface";

export function ViewBag(logger: Logger): IViewBag {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const views: Set<View> = new Set();

  const _updatableViews: Set<View> = new Set();
  let _view: null | View = null;

  function dispose(): void {
    views.forEach(_disposeView);

    // Clear views references so they can be garbage collected.
    views.clear();
    _updatableViews.clear();

    state.isDisposed = true;
  }

  function mount(): void {
    views.forEach(_mountView);

    state.isMounted = true;
  }

  function preload(): void {
    views.forEach(_preloadView);
    updatePreloadingState();
  }

  function unmount(): void {
    views.forEach(_unmountView);

    state.isMounted = false;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    for (_view of _updatableViews) {
      _view.update(delta, elapsedTime, tickTimerState);
    }
  }

  function updatePreloadingState(): void {
    for (_view of views) {
      if (_view.state.isPreloading) {
        state.isPreloading = true;
        return;
      }

      if (!_view.state.isPreloaded) {
        return;
      }
    }

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function _disposeView(view: View): void {
    mountDispose(logger, view);
  }

  function _mountView(view: View): void {
    mountMount(logger, view);
  }

  function _preloadView(view: View): void {
    mountPreload(logger, view);

    if (view.needsUpdates) {
      _updatableViews.add(view);
    }
  }

  function _unmountView(view: View): void {
    mountUnmount(logger, view);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "ViewBag",
    state: state,
    views: views,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
    updatePreloadingState: updatePreloadingState,
  });
}
