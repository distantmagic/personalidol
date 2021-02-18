import { createSettingsHandle } from "./createSettingsHandle";

import type { Mesh } from "three/src/objects/Mesh";

import type { UserSettings } from "./UserSettings.type";
import type { UserSettingsManager as IUserSettingsManager } from "./UserSettingsManager.interface";

export function MeshUserSettingsManager(userSettings: UserSettings, mesh: Mesh): IUserSettingsManager {
  const applySetings = createSettingsHandle(userSettings, function () {
    mesh.castShadow = userSettings.useShadows;
    mesh.receiveShadow = userSettings.useShadows;
  });

  return Object.freeze({
    isUserSettingsManager: true,

    preload: applySetings,
    update: applySetings,
  });
}
