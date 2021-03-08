import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";
import type { WindowFocusObserverState } from "./WindowFocusObserverState.type";

export interface WindowFocusObserver extends MainLoopUpdatable, Service {
  readonly state: WindowFocusObserverState;
  readonly isWindowFocusObserver: true;
}
