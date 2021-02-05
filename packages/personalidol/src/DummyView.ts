import { MathUtils } from "three/src/math/MathUtils";
import { Object3D } from "three/src/core/Object3D";

import { noop } from "@personalidol/framework/src/noop";

import type { MountState } from "@personalidol/framework/src/MountState.type";

import type { EntityAny } from "./EntityAny.type";
import type { EntityView } from "./EntityView.interface";

export function DummyView(entity: EntityAny): EntityView {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;
  }

  function preload(): void {
    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: false,
    isScene: false,
    isView: true,
    name: `DummyView`,
    needsUpdates: true,
    object3D: new Object3D(),
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: noop,
  });
}
