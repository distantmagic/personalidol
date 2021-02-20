import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "./createRouter";

import type { UserSettings } from "./UserSettings.type";
import type { UserSettingsSync } from "./UserSettingsSync.interface";

export function MultiThreadUserSettingsSync(userSettings: UserSettings, userSettingsMessagePort: MessagePort, debugName: string): UserSettingsSync {
  userSettingsMessagePort.onmessage = createRouter({
    updateUserSettings(updatedUserSettings: UserSettings) {
      _lastSyncedVersion = userSettings.version;
      Object.assign(userSettings, updatedUserSettings);
    },
  });

  let _lastSyncedVersion: number = userSettings.version;

  function start(): void {}

  function stop(): void {}

  function update(delta: number): void {
    if (userSettings.version <= _lastSyncedVersion) {
      return;
    }

    _lastSyncedVersion = userSettings.version;
    userSettingsMessagePort.postMessage({
      updateUserSettings: userSettings,
    });
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isUserSettingsSync: true,
    name: `MultiThreadUserSettingsSync(${debugName})`,

    start: start,
    stop: stop,
    update: update,
  });
}
