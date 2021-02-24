import { MathUtils } from "three/src/math/MathUtils";

import { createSettingsHandle } from "@personalidol/framework/src/createSettingsHandle";
import { disposeWebGLRenderTarget } from "@personalidol/framework/src/disposeWebGLRenderTarget";

import type { PointLight } from "three/src/lights/PointLight";
import type { SpotLight } from "three/src/lights/SpotLight";

import type { UserSettingsManager } from "@personalidol/framework/src/UserSettingsManager.interface";
import type { UserSettingsManagerState } from "@personalidol/framework/src/UserSettingsManagerState.type";

import type { UserSettings } from "./UserSettings.type";

type SupportedLights = PointLight | SpotLight;

export function ShadowLightUserSettingsManager(userSettings: UserSettings, light: SupportedLights): UserSettingsManager {
  const state: UserSettingsManagerState = Object.seal({
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  const applySettings = createSettingsHandle(userSettings, function () {
    light.visible = userSettings.useDynamicLighting;
    light.castShadow = userSettings.useShadows;

    if (light.shadow.mapSize.height === userSettings.shadowMapSize && light.shadow.mapSize.width === userSettings.shadowMapSize) {
      return;
    }

    light.shadow.mapSize.height = userSettings.shadowMapSize;
    light.shadow.mapSize.width = userSettings.shadowMapSize;

    disposeWebGLRenderTarget(light.shadow.map);

    // @ts-ignore this is incorrectly typed in THREE, shadow map can be null
    // and will be recreated before the next render
    light.shadow.map = null;
  });

  function preload(): void {
    state.isPreloading = true;

    applySettings();

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isUserSettingsManager: true,
    name: "ShadowLightUserSettingsManager",
    state: state,

    preload: preload,
    update: applySettings,
  });
}
