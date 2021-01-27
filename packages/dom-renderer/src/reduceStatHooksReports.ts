import type { StatsCollectorReport } from "@personalidol/framework/src/StatsCollectorReport.type";
import type { StatsHookReportMessage } from "@personalidol/framework/src/StatsHookReportMessage.type";

export function reduceStatHooksReports(debugName: string, statsHookReports: ReadonlyArray<StatsHookReportMessage>): StatsCollectorReport {
  const statsCollectorReport: StatsCollectorReport = Object.seal({
    averageTicks: 0,
    debugName: debugName,
  });

  for (let statsHookReport of statsHookReports) {
    statsCollectorReport.averageTicks += statsHookReport.currentIntervalTicks;
  }

  statsCollectorReport.averageTicks /= statsHookReports.length;

  return statsCollectorReport;
}
