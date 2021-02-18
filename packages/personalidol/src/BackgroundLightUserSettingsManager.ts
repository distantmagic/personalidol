import { createSettingsHandle } from "./createSettingsHandle";

import type { AmbientLight } from "three/src/lights/AmbientLight";
import type { HemisphereLight } from "three/src/lights/HemisphereLight";

import type { UserSettings } from "./UserSettings.type";
import type { UserSettingsManager as IUserSettingsManager } from "./UserSettingsManager.interface";

type SupportedLights = AmbientLight | HemisphereLight;

const _lightDefaultIntensity: WeakMap<SupportedLights, number> = new WeakMap();

export function BackgroundLightUserSettingsManager(userSettings: UserSettings, light: SupportedLights): IUserSettingsManager {
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

  return Object.freeze({
    isUserSettingsManager: true,

    preload: applySettings,
    update: applySettings,
  });
}
