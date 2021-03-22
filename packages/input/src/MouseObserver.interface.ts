import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

import type { MouseObserverState } from "./MouseObserverState.type";

export interface MouseObserver extends MainLoopUpdatable, Service {
  readonly state: MouseObserverState;
  readonly isMouseObserver: true;
}
