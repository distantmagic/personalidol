import type { StatsReport } from "@personalidol/framework/src/StatsReport.type";

export type CSS2DRendererStatsReport = StatsReport & {
  renderElements: number;
};
