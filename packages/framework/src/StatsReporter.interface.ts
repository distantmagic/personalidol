import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";
import type { StatsHook } from "./StatsHook.interface";

export interface StatsReporter extends MainLoopUpdatable, Service {
  readonly hooks: Set<StatsHook>;
  readonly isStatsReporter: true;
}
