import { disposeWebGLRenderTarget } from "@personalidol/framework/src/disposeWebGLRenderTarget";

import { createSettingsHandle } from "./createSettingsHandle";

import type { PointLight } from "three/src/lights/PointLight";
import type { SpotLight } from "three/src/lights/SpotLight";

import type { UserSettings } from "./UserSettings.type";
import type { UserSettingsManager as IUserSettingsManager } from "./UserSettingsManager.interface";

type SupportedLights = PointLight | SpotLight;

export function ShadowLightUserSettingsManager(userSettings: UserSettings, light: SupportedLights): IUserSettingsManager {
  const applySettings = createSettingsHandle(userSettings, function () {
    light.visible = userSettings.useDynamicLighting;
    light.castShadow = userSettings.useShadows;

    if (light.shadow.mapSize.height === userSettings.shadowMapSize && light.shadow.mapSize.width === userSettings.shadowMapSize) {
      return;
    }

    light.shadow.mapSize.height = userSettings.shadowMapSize;
    light.shadow.mapSize.width = userSettings.shadowMapSize;

    disposeWebGLRenderTarget(light.shadow.map);

    // @ts-ignore
    light.shadow.map = null;
  });

  return Object.freeze({
    isUserSettingsManager: true,

    preload: applySettings,
    update: applySettings,
  });
}
