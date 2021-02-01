import { MathUtils } from "three/src/math/MathUtils";

import type { StatsHook } from "./StatsHook.interface";
import type { PerformanceMemory } from "./PerformanceMemory.type";
import type { PerformanceStatsReport } from "./PerformanceStatsReport.type";

const DEBUG_NAME: "performance" = "performance";

export function PerformanceStatsHook(): StatsHook {
  const statsReport: PerformanceStatsReport = {
    debugName: DEBUG_NAME,
    jsHeapSizeLimit: 0,
    totalJSHeapSize: 0,
    usedJSHeapSize: 0,
  };

  let _memory: null | PerformanceMemory = null;

  function reset(): void {}

  function update(delta: number): void {
    _memory = <PerformanceMemory>(globalThis.performance as any).memory;

    statsReport.jsHeapSizeLimit = _memory.jsHeapSizeLimit / 1024;
    statsReport.totalJSHeapSize = _memory.totalJSHeapSize / 1024;
    statsReport.usedJSHeapSize = _memory.usedJSHeapSize / 1024;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isPerformanceStatsHook: true,
    isStatsHook: true,
    name: `PerformanceStatsHook("${DEBUG_NAME}")`,
    statsReport: statsReport,

    reset: reset,
    update: update,
  });
}