import type { Mesh } from "three/src/objects/Mesh";

import type { UserSettings } from "./UserSettings.type";
import type { UserSettingsManager as IUserSettingsManager } from "./UserSettingsManager.interface";

export function MeshUserSettingsManager(userSettings: UserSettings, mesh: Mesh): IUserSettingsManager {
  let _lastAppliedVersion: number = -1;
  let _useShadows: boolean = false;

  function _applySettings(): void {
    if (userSettings.version <= _lastAppliedVersion) {
      return;
    }

    _lastAppliedVersion = userSettings.version;
    _useShadows = userSettings.useDynamicLighting && userSettings.useShadows;

    mesh.castShadow = _useShadows;
    mesh.receiveShadow = _useShadows;
  }

  return Object.freeze({
    isUserSettingsManager: true,

    preload: _applySettings,
    update: _applySettings,
  });
}
