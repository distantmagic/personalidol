import { MathUtils } from "three/src/math/MathUtils";

import { createSettingsHandle } from "@personalidol/framework/src/createSettingsHandle";
import { noop } from "@personalidol/framework/src/noop";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { StatsCollector } from "./StatsCollector.interface";
import type { StatsCollectorUserSettingsManager as IStatsCollectorUserSettingsManager } from "./StatsCollectorUserSettingsManager.interface";

export function StatsCollectorUserSettingsManager(userSettings: UserSettings, statsCollector: StatsCollector): IStatsCollectorUserSettingsManager {
  let _isCollectorStarted: boolean = false;

  const applySetings = createSettingsHandle(userSettings, function () {
    if (!userSettings.showStatsReporter && _isCollectorStarted) {
      stop();
      return;
    }

    if (userSettings.showStatsReporter && !_isCollectorStarted) {
      start();
    }
  });

  function start(): void {
    _isCollectorStarted = true;
    statsCollector.start();
  }

  function stop(): void {
    _isCollectorStarted = false;
    statsCollector.stop();
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    applySetings();

    if (userSettings.showStatsReporter && _isCollectorStarted) {
      statsCollector.update(delta, elapsedTime, tickTimerState);
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isUserSettingsManager: true,
    name: "StatsCollectorUserSettingsManager",

    preload: noop,
    start: start,
    stop: stop,
    update: update,
  });
}
