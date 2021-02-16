import type { UserSettings as BaseUserSettings } from "@personalidol/framework/src/UserSettings.type";

export type UserSettings = BaseUserSettings & {
  shadowMapSize: number;
  useDynamicLighting: boolean;
  useShadows: boolean;
};
