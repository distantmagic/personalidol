import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

import type { DirectorState } from "./DirectorState.type";

export interface Director extends MainLoopUpdatable, Service {
  readonly state: DirectorState;
}