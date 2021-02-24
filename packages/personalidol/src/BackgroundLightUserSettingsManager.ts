import { MathUtils } from "three/src/math/MathUtils";

import { createSettingsHandle } from "@personalidol/framework/src/createSettingsHandle";

import type { AmbientLight } from "three/src/lights/AmbientLight";
import type { HemisphereLight } from "three/src/lights/HemisphereLight";

import type { UserSettingsManager } from "@personalidol/framework/src/UserSettingsManager.interface";
import type { UserSettingsManagerState } from "@personalidol/framework/src/UserSettingsManagerState.type";

import type { UserSettings } from "./UserSettings.type";

type SupportedLights = AmbientLight | HemisphereLight;

const _lightDefaultIntensity: WeakMap<SupportedLights, number> = new WeakMap();

export function BackgroundLightUserSettingsManager(userSettings: UserSettings, light: SupportedLights): UserSettingsManager {
  const state: UserSettingsManagerState = Object.seal({
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  let _defaultLightIntensity: undefined | number = 0;

  const applySettings = createSettingsHandle(userSettings, function () {
    if (!_lightDefaultIntensity.has(light)) {
      _lightDefaultIntensity.set(light, light.intensity);
    }

    if (userSettings.useDynamicLighting) {
      _defaultLightIntensity = _lightDefaultIntensity.get(light);

      if ("number" !== typeof _defaultLightIntensity) {
        throw new Error("Unable to retrieve default light intensity.");
      }

      light.intensity = _defaultLightIntensity;
    } else {
      light.intensity = 1;
    }
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
    name: "BackgroundLightUserSettingsManager",
    state: state,

    preload: preload,
    update: applySettings,
  });
}
