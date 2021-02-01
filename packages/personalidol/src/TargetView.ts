import { MathUtils } from "three/src/math/MathUtils";
import { Object3D } from "three/src/core/Object3D";

import { noop } from "@personalidol/framework/src/noop";

import type { Object3D as IObject3D } from "three/src/core/Object3D";
import type { Scene } from "three/src/scenes/Scene";

import type { MountState } from "@personalidol/framework/src/MountState.type";

import type { EntityTarget } from "./EntityTarget.type";
import type { EntityView } from "./EntityView.interface";

// "target" is an abstract entity. At this point it won't be used with brushes,
// so the view is barebone.

export function TargetView(scene: Scene, entity: EntityTarget): EntityView {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const base: IObject3D = new Object3D();

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(base);
  }

  function preload(): void {
    state.isPreloading = false;
    state.isPreloaded = true;

    base.position.set(entity.origin.x, entity.origin.y, entity.origin.z);
  }

  function unmount(): void {
    state.isMounted = false;

    scene.remove(base);
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: false,
    isScene: false,
    isView: true,
    name: `TargetView(${entity.properties.targetname})`,
    needsUpdates: false,
    object3D: base,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: noop,
  });
}
