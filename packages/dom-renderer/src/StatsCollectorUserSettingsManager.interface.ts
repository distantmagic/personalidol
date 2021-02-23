import type { Service } from "@personalidol/framework/src/Service.interface";
import type { UserSettingsManager } from "@personalidol/framework/src/UserSettingsManager.interface";

export interface StatsCollectorUserSettingsManager extends Service, UserSettingsManager {}
