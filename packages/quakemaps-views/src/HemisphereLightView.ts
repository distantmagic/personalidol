import { HemisphereLight } from "three/src/lights/HemisphereLight";

import { noop } from "@personalidol/framework/src/noop";

import type { Scene } from "three/src/scenes/Scene";

import type { EntityLightHemisphere } from "@personalidol/quakemaps/src/EntityLightHemisphere.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { View } from "@personalidol/framework/src/View.interface";

export function HemisphereLightView(scene: Scene, entity: EntityLightHemisphere): View {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _hemisphereLight = new HemisphereLight(0xffffbb, 0x080820, entity.light);

  function dispose(): void {
    state.isDisposed = true;

    scene.remove(_hemisphereLight);
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_hemisphereLight);
  }

  function preload(): void {
    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;
  }

  return Object.freeze({
    isScene: false,
    isView: true,
    name: `HemisphereLight(${entity.light})`,
    needsUpdates: false,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: noop,
  });
}
