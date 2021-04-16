import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface DirectorPollablePreloadingObserver extends MainLoopUpdatable, Service {
  readonly isDirectorPollablePreloadingObserver: true;
}
