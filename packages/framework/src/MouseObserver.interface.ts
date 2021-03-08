import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { MouseObserverState } from "./MouseObserverState.type";
import type { Service } from "./Service.interface";

export interface MouseObserver extends MainLoopUpdatable, Service {
  readonly state: MouseObserverState;
  readonly isMouseObserver: true;
}
