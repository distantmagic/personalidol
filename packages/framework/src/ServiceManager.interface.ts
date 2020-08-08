import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface ServiceManager extends MainLoopUpdatable, Service {
  readonly services: Set<Service>;
}
