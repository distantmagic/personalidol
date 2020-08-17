import type { MainLoopUpdatable } from "@personalidol/framework/src//MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src//Service.interface";

import type { LoadingManagerProgress } from "./LoadingManagerProgress.type";

export interface LoadingManager extends MainLoopUpdatable, Service {
  getProgress(): LoadingManagerProgress;

  refreshProgress(): void;
}
