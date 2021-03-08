import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";
import type { TouchObserverState } from "./TouchObserverState.type";

export interface TouchObserver extends MainLoopUpdatable, Service {
  readonly state: TouchObserverState;
  readonly isTouchObserver: true;
}
