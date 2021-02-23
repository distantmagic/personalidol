import { createSettingsHandle } from "@personalidol/framework/src/createSettingsHandle";

import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import type { UserSettingsManager } from "@personalidol/framework/src/UserSettingsManager.interface";

import type { UserSettings } from "./UserSettings.type";

export function WebGLRendererUserSettingsManager(userSettings: UserSettings, renderer: WebGLRenderer): UserSettingsManager {
  const applySetings = createSettingsHandle(userSettings, function () {
    renderer.setPixelRatio(userSettings.devicePixelRatio * userSettings.pixelRatio);
  });

  return Object.freeze({
    isUserSettingsManager: true,

    preload: applySetings,
    update: applySetings,
  });
}
