import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface WorkerServiceClient extends MainLoopUpdatable, Service {
  readonly isWorkerServiceClient: true;

  ready(): Promise<void>;
}
