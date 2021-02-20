import type { UserSettings } from "./UserSettings.type";

export type IsUserSettingsValidCallback<U extends UserSettings> = (userSettings: any) => userSettings is U;
