import type { DirectorState } from "./DirectorState.type";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface Director extends MainLoopUpdatable, Service {
  readonly state: DirectorState;
}
