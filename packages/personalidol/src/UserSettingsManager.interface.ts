import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Preloadable } from "@personalidol/framework/src/Preloadable.interface";

export interface UserSettingsManager extends MainLoopUpdatable, Preloadable {
  isUserSettingsManager: true;
}
