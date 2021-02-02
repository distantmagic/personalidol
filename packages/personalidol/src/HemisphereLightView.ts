import { HemisphereLight } from "three/src/lights/HemisphereLight";
import { MathUtils } from "three/src/math/MathUtils";

import type { Scene } from "three/src/scenes/Scene";

import type { MountState } from "@personalidol/framework/src/MountState.type";

import type { EntityLightHemisphere } from "./EntityLightHemisphere.type";
import type { EntityView } from "./EntityView.interface";
import type { UserSettings } from "./UserSettings.type";

export function HemisphereLightView(userSettings: UserSettings, scene: Scene, entity: EntityLightHemisphere): EntityView {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  // const _hemisphereLight = new HemisphereLight(0xffffbb, 0x080820, entity.light);
  const _hemisphereLight = new HemisphereLight(0xffffff, 0x000000, entity.light);

  function dispose(): void {
    state.isDisposed = true;
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

    scene.remove(_hemisphereLight);
  }

  function update(): void {
    if (userSettings.useDynamicLighting) {
      _hemisphereLight.intensity = entity.light;
    } else {
      _hemisphereLight.intensity = 1;
    }
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: false,
    isScene: false,
    isView: true,
    name: `HemisphereLightView(${entity.light})`,
    needsUpdates: true,
    object3D: _hemisphereLight,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
  });
}
