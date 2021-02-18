import { AmbientLight } from "three/src/lights/AmbientLight";
import { MathUtils } from "three/src/math/MathUtils";

import { BackgroundLightUserSettingsManager } from "./BackgroundLightUserSettingsManager";

import type { Scene } from "three/src/scenes/Scene";

import type { ViewState } from "@personalidol/framework/src/ViewState.type";

import type { EntityLightAmbient } from "./EntityLightAmbient.type";
import type { EntityView } from "./EntityView.interface";
import type { UserSettings } from "./UserSettings.type";

export function AmbientLightView(userSettings: UserSettings, scene: Scene, entity: EntityLightAmbient): EntityView {
  const state: ViewState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _ambientLight = new AmbientLight(0xffffff, entity.light);
  const _userSettingsManager = BackgroundLightUserSettingsManager(userSettings, _ambientLight);

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_ambientLight);
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    state.isPreloading = true;

    _userSettingsManager.preload();

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    scene.remove(_ambientLight);
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
    name: `AmbientLightView(${entity.light})`,
    needsUpdates: true,
    object3D: _ambientLight,
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
