import { MathUtils } from "three/src/math/MathUtils";

import { createSettingsHandle } from "@personalidol/framework/src/createSettingsHandle";

import type { Mesh } from "three/src/objects/Mesh";

import type { UserSettingsManager } from "@personalidol/framework/src/UserSettingsManager.interface";
import type { UserSettingsManagerState } from "@personalidol/framework/src/UserSettingsManagerState.type";

import type { UserSettings } from "./UserSettings.type";

export function MeshUserSettingsManager(userSettings: UserSettings, mesh: Mesh): UserSettingsManager {
  const state: UserSettingsManagerState = {
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  };

  const applySettings = createSettingsHandle(userSettings, function () {
    mesh.castShadow = userSettings.useShadows;
    mesh.receiveShadow = userSettings.useShadows;
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
    name: "MeshUserSettingsManager",
    state: state,

    preload: preload,
    update: applySettings,
  });
}
