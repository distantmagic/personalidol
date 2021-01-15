import { MathUtils } from "three/src/math/MathUtils";

import { mountDispose } from "@personalidol/framework/src/mountDispose";
import { mountMount } from "@personalidol/framework/src/mountMount";
import { mountPreload } from "@personalidol/framework/src/mountPreload";
import { mountUnmount } from "@personalidol/framework/src/mountUnmount";
import { name } from "@personalidol/framework/src/name";

import type { Logger } from "loglevel";

import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { Scene } from "@personalidol/framework/src/Scene.interface";

import type { ViewBagScene as IViewBagScene } from "./ViewBagScene.interface";
import type { ViewBag as IViewBag } from "./ViewBag.interface";

/**
 * This class preloads scene views after the scene itself is fully preloaded
 * and views list is populated.
 */
export function ViewBagScene(logger: Logger, viewBag: IViewBag, scene: Scene): IViewBagScene {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  function dispose(): void {
    mountDispose(logger, scene);
    mountDispose(logger, viewBag);

    state.isDisposed = true;
  }

  function mount(): void {
    mountMount(logger, scene);
    mountMount(logger, viewBag);

    state.isMounted = true;
  }

  function preload(): void {
    // Order here is important. View bag needs to be preloaded only after
    // the scene.preload method is called, since it's the place to add
    // views to a ViewBag.
    mountPreload(logger, scene);
    updatePreloadingState();
  }

  function unmount(): void {
    mountUnmount(logger, scene);
    mountUnmount(logger, viewBag);

    state.isMounted = false;
  }

  function update(delta: number, elapsedTime: number): void {
    // It's important to update the scene first and then update the included
    // views to preserve the hierarchy.
    scene.update(delta, elapsedTime);
    viewBag.update(delta, elapsedTime);
  }

  function updatePreloadingState(): void {
    if (scene.state.isPreloaded && !viewBag.state.isPreloading && !viewBag.state.isPreloaded) {
      // ViewBag can be preloaded now since the scene is ready.
      mountPreload(logger, viewBag);
    }

    if (viewBag.state.isPreloading && !scene.state.isPreloaded) {
      throw new Error("ViewBag may only start preloading if scene is fully preloaded.");
    }

    if (viewBag.state.isPreloading) {
      viewBag.updatePreloadingState();
    }

    state.isPreloaded = scene.state.isPreloaded && viewBag.state.isPreloaded;
    state.isPreloading = scene.state.isPreloading || viewBag.state.isPreloading;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isScene: true,
    isView: false,
    name: `ViewBagScene(${name(viewBag)},${name(scene)})`,
    scene: scene,
    state: state,
    viewBag: viewBag,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
    updatePreloadingState: updatePreloadingState,
  });
}
