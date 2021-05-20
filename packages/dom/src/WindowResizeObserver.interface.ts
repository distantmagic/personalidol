import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

export interface WindowResizeObserver extends MainLoopUpdatable, Service {
  isWindowResizeObserver: true;
}
