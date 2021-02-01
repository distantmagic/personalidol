import type { UserSettings as BaseUserSettings } from "@personalidol/user-settings/src/UserSettings.type";

export type UserSettings = BaseUserSettings & {
  useDynamicLighting: boolean;
  useShadows: boolean;
};
