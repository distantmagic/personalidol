import type { StatsReport } from "./StatsReport.type";

export function isStatsReport(report: any): report is StatsReport {
  if ("object" !== typeof report) {
    return false;
  }

  return "string" === typeof report.debugName;
}
