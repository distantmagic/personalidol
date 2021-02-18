import type { PointLight } from "three/src/lights/PointLight";
import type { SpotLight } from "three/src/lights/SpotLight";

import type { UserSettings } from "./UserSettings.type";
import type { UserSettingsManager as IUserSettingsManager } from "./UserSettingsManager.interface";

type SupportedLights = PointLight | SpotLight;

export function ShadowLightUserSettingsManager(userSettings: UserSettings, light: SupportedLights): IUserSettingsManager {
  let _lastAppliedVersion: number = -1;
  let _useShadows: boolean = false;

  function _applySettings(): void {
    if (userSettings.version <= _lastAppliedVersion) {
      return;
    }

    _lastAppliedVersion = userSettings.version;
    _useShadows = userSettings.useDynamicLighting && userSettings.useShadows;

    light.visible = userSettings.useDynamicLighting;
    light.castShadow = _useShadows;
  }

  return Object.freeze({
    isUserSettingsManager: true,

    preload: _applySettings,
    update: _applySettings,
  });
}
