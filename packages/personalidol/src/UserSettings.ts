import type { UserSettings as IUserSettings } from "./UserSettings.type";

function createEmptyState(): IUserSettings {
  return {
    shadowMapSize: 512,
    useDynamicLighting: true,
    useShadows: true,
    version: 0,
  };
}

export const UserSettings = Object.freeze({
  createEmptyState: createEmptyState,
});
