import type { StatsReport } from "./StatsReport.type";

export type MainLoopStatsReport = StatsReport & {
  currentInterval: number;
  currentIntervalDuration: number;
  currentIntervalTicks: number;
  schedulerName: string;
  tickerName: string;
};
