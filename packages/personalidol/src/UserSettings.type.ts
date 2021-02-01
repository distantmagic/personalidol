import type { UserSettings as BaseUserSettings } from "@personalidol/user-settings/src/UserSettings.type";

export type UserSettings = BaseUserSettings & {
  lastUpdate: number;

  shadowMapSize: number;
  useDynamicLighting: boolean;
  useShadows: boolean;
};
