import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface UserSettingsSync extends MainLoopUpdatable, Service {
  isUserSettingsSync: true;
}
