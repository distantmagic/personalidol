import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface WorkerService extends MainLoopUpdatable, Service {
  ready(): Promise<void>;
}
