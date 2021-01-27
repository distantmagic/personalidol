import { MathUtils } from "three/src/math/MathUtils";

import type { MainLoopStatsHook as IMainLoopStatsHook } from "./MainLoopStatsHook.interface";
import type { MainLoopStatsReport } from "./MainLoopStatsReport.type";

const INTERVAL_S: number = 1;
// const memory: any = (performance as any).memory;

export function MainLoopStatsHook(debugName: string, statsMessagePort: MessagePort): IMainLoopStatsHook {
  let _currentInterval: number = 0;
  let _currentIntervalDuration: number = 0;
  let _currentIntervalTicks: number = 0;

  function _reportInterval() {
    statsMessagePort.postMessage({
      statsReport: <MainLoopStatsReport>{
        currentInterval: _currentInterval,
        currentIntervalDuration: _currentIntervalDuration,
        currentIntervalTicks: _currentIntervalTicks,
        debugName: debugName,
      },
    });
  }

  function _resetInterval() {
    _currentIntervalDuration = 0;
    _currentIntervalTicks = 0;
    _currentInterval += 1;
  }

  function tick(delta: number): void {
    _currentIntervalDuration += delta;
    _currentIntervalTicks += 1;

    if (_currentIntervalDuration >= INTERVAL_S) {
      _reportInterval();
      _resetInterval();
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: `MainLoopStatsHook("${debugName}")`,

    tick: tick,
  });
}
