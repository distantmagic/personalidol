import { createSettingsHandle } from "@personalidol/framework/src/createSettingsHandle";

import type { Mesh } from "three/src/objects/Mesh";

import type { UserSettingsManager } from "@personalidol/framework/src/UserSettingsManager.interface";

import type { UserSettings } from "./UserSettings.type";

export function MeshUserSettingsManager(userSettings: UserSettings, mesh: Mesh): UserSettingsManager {
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
