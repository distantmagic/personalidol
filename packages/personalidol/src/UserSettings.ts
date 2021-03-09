import { UserSettingsDynamicLightQualityMap } from "./UserSettingsDynamicLightQualityMap.enum";

import type { UserSettings as IUserSettings } from "./UserSettings.type";

function createEmptyState(pixelRatio: number): IUserSettings {
  return {
    cameraMovementSpeed: 800,
    cameraType: "PerspectiveCamera",
    devicePixelRatio: pixelRatio,
    dynamicLightQuality: UserSettingsDynamicLightQualityMap.Low,
    language: "en",
    pixelRatio: 1,
    shadowMapSize: 512,
    showStatsReporter: false,
    useOffscreenCanvas: false,
    useShadows: true,
    version: 0,
  };
}

export const UserSettings = Object.freeze({
  createEmptyState: createEmptyState,
});
