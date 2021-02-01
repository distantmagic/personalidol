import { Nameable } from "./Nameable.interface";
import { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import { StatsReport } from "./StatsReport.type";

export interface StatsHook extends MainLoopUpdatable, Nameable {
  readonly isStatsHook: true;
  readonly statsReport: StatsReport;

  reset(): void;
}
