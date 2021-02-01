import { MathUtils } from "three/src/math/MathUtils";

import type { MainLoopStatsHook as IMainLoopStatsHook } from "./MainLoopStatsHook.interface";
import type { MainLoopStatsReport } from "./MainLoopStatsReport.type";

export function MainLoopStatsHook(debugName: string): IMainLoopStatsHook {
  const statsReport: MainLoopStatsReport = {
    currentInterval: 0,
    currentIntervalDuration: 0,
    currentIntervalTicks: 0,
    debugName: debugName,
  };

  function reset(): void {
    statsReport.currentInterval += 1;
    statsReport.currentIntervalDuration = 0;
    statsReport.currentIntervalTicks = 0;
  }

  function update(delta: number): void {
    statsReport.currentIntervalDuration += delta;
    statsReport.currentIntervalTicks += 1;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isMainLoopStatsHook: true,
    isStatsHook: true,
    name: `MainLoopStatsHook("${debugName}")`,
    statsReport: statsReport,

    reset: reset,
    update: update,
  });
}
