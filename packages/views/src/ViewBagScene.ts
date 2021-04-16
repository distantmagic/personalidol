import { MathUtils } from "three/src/math/MathUtils";

import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { mount as fMount } from "@personalidol/framework/src/mount";
import { name } from "@personalidol/framework/src/name";
import { pause as fPause } from "@personalidol/framework/src/pause";
import { preload as fPreload } from "@personalidol/framework/src/preload";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";
import { unpause as fUnpause } from "@personalidol/framework/src/unpause";

import type { Logger } from "loglevel";

import type { SceneState } from "@personalidol/framework/src/SceneState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { ViewBag as IViewBag } from "./ViewBag.interface";
import type { ViewBaggableScene } from "./ViewBaggableScene.interface";
import type { ViewBagScene as IViewBagScene } from "./ViewBagScene.interface";

/**
 * This class preloads scene views after the scene itself is fully preloaded
 * and views list is populated.
 */
export function ViewBagScene(logger: Logger, viewBag: IViewBag, scene: ViewBaggableScene): IViewBagScene {
  const state: SceneState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  function dispose(): void {
    fDispose(logger, scene);
    fDispose(logger, viewBag);

    state.isDisposed = true;
  }

  function mount(): void {
    fMount(logger, scene);
    fMount(logger, viewBag);

    state.isMounted = true;
  }

  function pause(): void {
    state.isPaused = true;

    fPause(logger, scene);
    fPause(logger, viewBag);
  }

  function preload(): void {
    // Order here is important. View bag needs to be preloaded only after
    // the scene.preload method is called, since it's the place to add
    // views to a ViewBag.
    fPreload(logger, scene);

    state.isPreloading = true;
    state.isPreloaded = false;
  }

  function unmount(): void {
    fUnmount(logger, scene);
    fUnmount(logger, viewBag);

    state.isMounted = false;
  }

  function unpause(): void {
    state.isPaused = false;

    fUnpause(logger, scene);
    fUnpause(logger, viewBag);
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    // It's usually better to update views first, because scene renders
    // everyhting in the end.
    viewBag.update(delta, elapsedTime, tickTimerState);
    scene.update(delta, elapsedTime, tickTimerState);
  }

  function updatePreloadingState(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    if (scene.state.isPreloaded && !viewBag.state.isPreloading && !viewBag.state.isPreloaded) {
      // ViewBag can be preloaded now since the scene is ready.
      fPreload(logger, viewBag);
    }

    if (viewBag.state.isPreloading && !scene.state.isPreloaded) {
      throw new Error("ViewBag may only start preloading if scene is fully preloaded.");
    }

    if (viewBag.state.isPreloading) {
      viewBag.updatePreloadingState(delta, elapsedTime, tickTimerState);
    }

    state.isPreloaded = scene.state.isPreloaded && viewBag.state.isPreloaded;
    state.isPreloading = scene.state.isPreloading || viewBag.state.isPreloading;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isDisposable: true,
    isMountable: true,
    isPollablePreloading: true,
    isPreloadable: true,
    isScene: true,
    isViewBagScene: true,
    name: `ViewBagScene(${name(viewBag)},${name(scene)})`,
    scene: scene,
    state: state,
    viewBag: viewBag,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: update,
    updatePreloadingState: updatePreloadingState,
  });
}
