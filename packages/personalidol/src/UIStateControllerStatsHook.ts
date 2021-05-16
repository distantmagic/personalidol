import { generateUUID } from "@personalidol/math/src/generateUUID";

import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { StatsHook } from "@personalidol/framework/src/StatsHook.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { UIStateController } from "./UIStateController.interface";
import type { UIStateControllerStatsReport } from "./UIStateControllerStatsReport.type";

const DEBUG_NAME: "ui_cntrlr" = "ui_cntrlr";

export function UIStateControllerStatsHook(uiStateController: UIStateController): StatsHook {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });
  const statsReport: UIStateControllerStatsReport = {
    currentLocationMap: "",
    debugName: DEBUG_NAME,
    isScenePaused: false,
    lastUpdate: 0,
    previousLocationMap: "",
  };

  function reset(): void {}

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    statsReport.currentLocationMap = String(uiStateController.uiState.currentLocationMap);
    statsReport.isScenePaused = uiStateController.uiState.isScenePaused;
    statsReport.lastUpdate = tickTimerState.currentTick;
    statsReport.previousLocationMap = String(uiStateController.uiState.previousLocationMap);
  }

  return Object.freeze({
    id: generateUUID(),
    isStatsHook: true,
    name: `UIStateControllerStatsHook("${DEBUG_NAME}")`,
    state: state,
    statsReport: statsReport,
    statsReportIntervalSeconds: 1,

    reset: reset,
    update: update,
  });
}
