import type { UserSettings as IUserSettings } from "./UserSettings.type";

function createEmptyState(): IUserSettings {
  return {
    showStatsReporter: false,
    version: 0,
  };
}

export const UserSettings = Object.freeze({
  createEmptyState: createEmptyState,
});
