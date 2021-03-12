import { UserSettings as BaseUserSettings } from "@personalidol/framework/src/UserSettings";

import { UserSettingsDynamicLightQualityMap } from "./UserSettingsDynamicLightQualityMap.enum";

import type { UserSettings as IUserSettings } from "./UserSettings.type";

function createEmptyState(pixelRatio: number): IUserSettings {
  return Object.assign(BaseUserSettings.createEmptyState(), {
    cameraMovementSpeed: 800,
    cameraType: "PerspectiveCamera" as IUserSettings["cameraType"],
    devicePixelRatio: pixelRatio,
    dynamicLightQuality: UserSettingsDynamicLightQualityMap.Low,
    language: "en",
    pixelRatio: 1,
    shadowMapSize: 512 as IUserSettings["shadowMapSize"],
    useOffscreenCanvas: false,
    useShadows: true,
  });
}

export const UserSettings = Object.freeze({
  createEmptyState: createEmptyState,
});
