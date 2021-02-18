import type { GenericCallback } from "@personalidol/framework/src/GenericCallback.type";

import type { UserSettings } from "./UserSettings.type";

export function createSettingsHandle(userSettings: UserSettings, callback: GenericCallback): GenericCallback {
  let _lastAppliedVersion: number = -1;

  return function () {
    if (userSettings.version <= _lastAppliedVersion) {
      return;
    }

    _lastAppliedVersion = userSettings.version;
    callback();
  };
}
