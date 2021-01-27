import type { StatsCollectorReport } from "@personalidol/framework/src/StatsCollectorReport.type";
import type { StatsHookReportMessage } from "@personalidol/framework/src/StatsHookReportMessage.type";

export function reduceStatHooksReports(debugName: string, statsHookReports: ReadonlyArray<StatsHookReportMessage>): StatsCollectorReport {
  let _totalDuration: number = 0;
  let _totalTicks: number = 0;

  // Newest ticks have the highest weights.
  for (let i = 0; i < statsHookReports.length; i += 1) {
    _totalDuration += (i + 1) * statsHookReports[i].currentIntervalDuration;
    _totalTicks += (i + 1) * statsHookReports[i].currentIntervalTicks;
  }

  return Object.seal({
    averageTicks: _totalTicks / _totalDuration,
    debugName: debugName,
  });
}
