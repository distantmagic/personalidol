import { MathUtils } from "three/src/math/MathUtils";

import type { MainLoop } from "./MainLoop.interface";
import type { MainLoopStatsHook as IMainLoopStatsHook } from "./MainLoopStatsHook.interface";
import type { MainLoopStatsReport } from "./MainLoopStatsReport.type";
import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";

const DEBUG_NAME: "main_loop" = "main_loop";

export function MainLoopStatsHook(mainLoop: MainLoop): IMainLoopStatsHook {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });
  const statsReport: MainLoopStatsReport = {
    currentInterval: 0,
    currentIntervalDuration: 0,
    currentIntervalTicks: 0,
    debugName: DEBUG_NAME,
    lastUpdate: 0,
  };

  function reset(): void {
    statsReport.currentInterval += 1;
    statsReport.currentIntervalDuration = 0;
    statsReport.currentIntervalTicks = 0;
  }

  function update(): void {
    statsReport.currentIntervalDuration += mainLoop.tickTimerState.delta;
    statsReport.currentIntervalTicks += 1;
    statsReport.lastUpdate = mainLoop.tickTimerState.currentTick;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isMainLoopStatsHook: true,
    isStatsHook: true,
    name: `MainLoopStatsHook("${DEBUG_NAME}")`,
    state: state,
    statsReport: statsReport,
    statsReportIntervalSeconds: 1,

    reset: reset,
    update: update,
  });
}
