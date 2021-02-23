import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Preloadable } from "./Preloadable.interface";

export interface UserSettingsManager extends MainLoopUpdatable, Preloadable {
  isUserSettingsManager: true;
}
