import { MathUtils } from "three/src/math/MathUtils";

import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { StatsHook } from "./StatsHook.interface";
import type { StatsReport } from "./StatsReport.type";
import type { StatsReporter as IStatsReporter } from "./StatsReporter.interface";
import type { TickTimerState } from "./TickTimerState.type";

type HooksStatuses = WeakMap<StatsHook, ReportStatus>;

type ReportStatus = {
  lastUpdate: number;
};

function _shouldReport(hooksStatuses: HooksStatuses, hook: StatsHook, elapsedTime: number): boolean {
  const hookStatus: undefined | ReportStatus = hooksStatuses.get(hook);

  if (!hookStatus) {
    hooksStatuses.set(hook, <ReportStatus>{
      lastUpdate: elapsedTime,
    });

    return true;
  }

  if (elapsedTime - hookStatus.lastUpdate < hook.statsReportIntervalSeconds) {
    return false;
  }

  hookStatus.lastUpdate = elapsedTime;

  return true;
}

export function StatsReporter(debugName: string, statsMessagePort: MessagePort): IStatsReporter {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  const hooks: Set<StatsHook> = new Set();

  const _hooksStatuses: HooksStatuses = new WeakMap();
  const _statsReport: StatsReport = {
    debugName: debugName,
    lastUpdate: 0,
  };

  function start() {}

  function stop() {}

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {
    for (let hook of hooks) {
      if (_shouldReport(_hooksStatuses, hook, elapsedTime)) {
        _statsReport[hook.statsReport.debugName] = Object.assign({}, hook.statsReport);
        _statsReport.lastUpdate = tickTimerState.currentTick;
        hook.reset();
      }
    }

    statsMessagePort.postMessage({
      statsReport: _statsReport,
    });
  }

  return Object.freeze({
    hooks: hooks,
    id: MathUtils.generateUUID(),
    isStatsReporter: true,
    name: "StatsReporter",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
