import { AmbientLight } from "three/src/lights/AmbientLight";
import { MathUtils } from "three/src/math/MathUtils";

import { noop } from "@personalidol/framework/src/noop";

import type { Scene } from "three/src/scenes/Scene";

import type { EntityLightAmbient } from "@personalidol/personalidol-mapentities/src/EntityLightAmbient.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { View } from "@personalidol/framework/src/View.interface";

export function AmbientLightView(scene: Scene, entity: EntityLightAmbient): View {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _ambientLight = new AmbientLight(0xffffff, entity.light);

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_ambientLight);
  }

  function preload(): void {
    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    scene.remove(_ambientLight);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isScene: false,
    isView: true,
    name: `AmbientLightView(${entity.light})`,
    needsUpdates: false,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: noop,
  });
}
