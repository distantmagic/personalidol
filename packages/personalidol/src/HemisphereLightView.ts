import { HemisphereLight } from "three/src/lights/HemisphereLight";
import { MathUtils } from "three/src/math/MathUtils";

import { preload as fPreload } from "@personalidol/framework/src/preload";

import { BackgroundLightUserSettingsManager } from "./BackgroundLightUserSettingsManager";

import type { Logger } from "loglevel";
import type { Scene } from "three/src/scenes/Scene";

import type { ViewState } from "@personalidol/views/src/ViewState.type";

import type { EntityLightHemisphere } from "./EntityLightHemisphere.type";
import type { EntityView } from "./EntityView.interface";
import type { UserSettings } from "./UserSettings.type";

export function HemisphereLightView(logger: Logger, userSettings: UserSettings, scene: Scene, entity: EntityLightHemisphere): EntityView<EntityLightHemisphere> {
  const state: ViewState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    isRayIntersecting: false,
    needsRaycast: false,
    needsUpdates: true,
  });

  // const _hemisphereLight = new HemisphereLight(0xffffbb, 0x080820, entity.light);
  const _hemisphereLight = new HemisphereLight(0xffffff, 0x000000, entity.light);
  const _userSettingsManager = BackgroundLightUserSettingsManager(userSettings, _hemisphereLight);

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_hemisphereLight);
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    state.isPreloading = true;

    fPreload(logger, _userSettingsManager);

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    scene.remove(_hemisphereLight);
  }

  function unpause(): void {
    state.isPaused = false;
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isDisposable: true,
    isEntityView: true,
    isExpectingTargets: false,
    isMountable: true,
    isPreloadable: true,
    isRaycastable: true,
    isView: true,
    name: `HemisphereLightView(${entity.light})`,
    object3D: _hemisphereLight,
    raycasterObject3D: _hemisphereLight,
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: _userSettingsManager.update,
  });
}
