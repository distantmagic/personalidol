import { StatsHook } from "./StatsHook.interface";

export interface MainLoopStatsHook extends StatsHook {
  readonly isMainLoopStatsHook: true;
}
