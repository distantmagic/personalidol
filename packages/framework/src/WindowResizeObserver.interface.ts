import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface WindowResizeObserver extends MainLoopUpdatable, Service {
  isWindowResizeObserver: true;
}
