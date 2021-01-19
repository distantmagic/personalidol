import { Euler } from "three/src/math/Euler";
import { MathUtils } from "three/src/math/MathUtils";
import { Vector3 } from "three/src/math/Vector3";

import { noop } from "@personalidol/framework/src/noop";

import type { Euler as IEuler } from "three/src/math/Euler";
import type { Scene } from "three/src/scenes/Scene";
import type { Vector3 as IVector3 } from "three/src/math/Vector3";

import type { EntityPlayer } from "@personalidol/personalidol-mapentities/src/EntityPlayer.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";

import type { EntityView } from "./EntityView.interface";

export function PlayerView(scene: Scene, entity: EntityPlayer): EntityView {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const viewPosition: IVector3 = new Vector3();
  const viewRotation: IEuler = new Euler();

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
    name: `PlayerView`,
    needsUpdates: false,
    state: state,
    viewPosition: viewPosition,
    viewRotation: viewRotation,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: noop,
  });
}
