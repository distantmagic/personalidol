import type { UserSettingsManagerState } from "./UserSettingsManagerState.type";

import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Preloadable } from "./Preloadable.interface";

export interface UserSettingsManager extends MainLoopUpdatable, Preloadable {
  readonly state: UserSettingsManagerState;

  isUserSettingsManager: true;
}
