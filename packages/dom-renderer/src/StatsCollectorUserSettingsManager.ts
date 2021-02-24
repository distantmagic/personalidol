import { MathUtils } from "three/src/math/MathUtils";

import { createSettingsHandle } from "@personalidol/framework/src/createSettingsHandle";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";
import type { UserSettingsManagerState } from "@personalidol/framework/src/UserSettingsManagerState.type";

import type { StatsCollector } from "./StatsCollector.interface";
import type { StatsCollectorUserSettingsManager as IStatsCollectorUserSettingsManager } from "./StatsCollectorUserSettingsManager.interface";

export function StatsCollectorUserSettingsManager(userSettings: UserSettings, statsCollector: StatsCollector): IStatsCollectorUserSettingsManager {
  const state: UserSettingsManagerState = Object.seal({
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  let _isCollectorStarted: boolean = false;

  const applySettings = createSettingsHandle(userSettings, function () {
    if (!userSettings.showStatsReporter && _isCollectorStarted) {
      stop();
      return;
    }

    if (userSettings.showStatsReporter && !_isCollectorStarted) {
      start();
    }
  });

  function preload(): void {
    state.isPreloading = true;

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function start(): void {
    _isCollectorStarted = true;
    statsCollector.start();
  }

  function stop(): void {
    _isCollectorStarted = false;
    statsCollector.stop();
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    applySettings();

    if (userSettings.showStatsReporter && _isCollectorStarted) {
      statsCollector.update(delta, elapsedTime, tickTimerState);
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isUserSettingsManager: true,
    name: "StatsCollectorUserSettingsManager",
    state: state,

    preload: preload,
    start: start,
    stop: stop,
    update: update,
  });
}
