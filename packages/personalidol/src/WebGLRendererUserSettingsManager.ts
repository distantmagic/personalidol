import { createSettingsHandle } from "./createSettingsHandle";

import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import type { UserSettings } from "./UserSettings.type";
import type { UserSettingsManager as IUserSettingsManager } from "./UserSettingsManager.interface";

export function WebGLRendererUserSettingsManager(userSettings: UserSettings, renderer: WebGLRenderer): IUserSettingsManager {
  const applySetings = createSettingsHandle(userSettings, function () {
    renderer.setPixelRatio(userSettings.devicePixelRatio * userSettings.pixelRatio);
  });

  return Object.freeze({
    isUserSettingsManager: true,

    preload: applySetings,
    update: applySetings,
  });
}
