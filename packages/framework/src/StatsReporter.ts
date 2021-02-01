import { MathUtils } from "three/src/math/MathUtils";

import type { StatsHook } from "./StatsHook.interface";
import type { StatsReport } from "./StatsReport.type";
import type { StatsReporter as IStatsReporter } from "./StatsReporter.interface";

const REPORT_INTERVAL_S: number = 1;

export function StatsReporter(debugName: string, statsMessagePort: MessagePort): IStatsReporter {
  const hooks: Set<StatsHook> = new Set();

  const _statsReport: StatsReport = {
    debugName: debugName,
  };

  let _currentIntervalDuration: number = 0;

  function _reportStats() {
    for (let hook of hooks) {
      _statsReport[hook.statsReport.debugName] = Object.assign({}, hook.statsReport);
      hook.reset();
    }

    statsMessagePort.postMessage({
      statsReport: _statsReport,
    });
  }

  function start() {}

  function stop() {}

  function update(delta: number) {
    _currentIntervalDuration += delta;

    if (_currentIntervalDuration < REPORT_INTERVAL_S) {
      return;
    }

    _reportStats();
    _currentIntervalDuration = 0;
  }

  return Object.freeze({
    hooks: hooks,
    id: MathUtils.generateUUID(),
    isStatsReporter: true,
    name: "StatsReporter",

    start: start,
    stop: stop,
    update: update,
  });
}
