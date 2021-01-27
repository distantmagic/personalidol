import type { StatsCollectorReport } from "@personalidol/framework/src/StatsCollectorReport.type";
import type { StatsHookReportMessage } from "@personalidol/framework/src/StatsHookReportMessage.type";

export function reduceStatHooksReports(debugName: string, statsHookReports: ReadonlyArray<StatsHookReportMessage>): StatsCollectorReport {
  let _totalDuration: number = 0;
  let _totalTicks: number = 0;

  for (let statsHookReport of statsHookReports) {
    _totalDuration += statsHookReport.currentIntervalDuration;
    _totalTicks += statsHookReport.currentIntervalTicks;
  }

  return Object.seal({
    averageTicks: _totalTicks / _totalDuration,
    debugName: debugName,
  });
}
