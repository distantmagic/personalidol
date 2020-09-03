import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

export interface WorkerService extends MainLoopUpdatable, Service {
  ready(): Promise<void>;
}