import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface MouseObserver extends MainLoopUpdatable, Service {
  isMouseObserver: true;
}
