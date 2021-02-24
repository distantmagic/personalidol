import { MathUtils } from "three/src/math/MathUtils";
import { Object3D } from "three/src/core/Object3D";

import { noop } from "@personalidol/framework/src/noop";

import type { Object3D as IObject3D } from "three/src/core/Object3D";
import type { Scene } from "three/src/scenes/Scene";

import type { ViewState } from "@personalidol/framework/src/ViewState.type";

import type { EntityPlayer } from "./EntityPlayer.type";
import type { EntityView } from "./EntityView.interface";

export function PlayerView(scene: Scene, entity: EntityPlayer): EntityView {
  const state: ViewState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: false,
  });

  const object3D: IObject3D = new Object3D();

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;
  }

  function unpause(): void {
    state.isPaused = false;
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: false,
    isScene: false,
    isView: true,
    name: `PlayerView`,
    object3D: object3D,
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: noop,
  });
}
