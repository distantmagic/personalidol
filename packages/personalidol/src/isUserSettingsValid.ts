import type { UserSettings } from "./UserSettings.type";

export function isUserSettingsValid(userSettings: any): userSettings is UserSettings {
  if (!userSettings) {
    return false;
  }

  if ("object" !== typeof userSettings) {
    return false;
  }

  if (Boolean(userSettings.prototype)) {
    // If settings have someting in the prototype, just discard them.
    return false;
  }

  if ("number" !== typeof userSettings.devicePixelRatio) {
    return false;
  }

  if ("number" !== typeof userSettings.dynamicLightQuality) {
    return false;
  }

  if ("number" !== typeof userSettings.pixelRatio) {
    return false;
  }

  if ("boolean" !== typeof userSettings.showStatsReporter) {
    return false;
  }

  if ("boolean" !== typeof userSettings.useShadows) {
    return false;
  }

  if ("number" !== typeof userSettings.version) {
    return false;
  }

  if ("number" !== typeof userSettings.shadowMapSize) {
    return false;
  }

  switch (userSettings.shadowMapSize) {
    case 512:
    case 1024:
    case 2048:
    case 4096:
      return true;
  }

  return false;
}
