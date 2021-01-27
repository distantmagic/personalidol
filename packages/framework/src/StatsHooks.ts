import { MathUtils } from "three/src/math/MathUtils";

import type { StatsHookReportMessage } from "./StatsHookReportMessage.type";
import type { StatsHooks as IStats } from "./StatsHooks.interface";

const INTERVAL_S: number = 1;
// const memory: any = (performance as any).memory;

export function StatsHooks(debugName: string, statsMessagePort: MessagePort): IStats {
  let _currentInterval: number = 0;
  let _currentIntervalDuration: number = 0;
  let _currentIntervalTicks: number = 0;

  function _reportInterval() {
    statsMessagePort.postMessage({
      statsReport: <StatsHookReportMessage>{
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

  function tickEnd(elapsedTime: number): void {
    _currentIntervalTicks += 1;

    if (_currentIntervalDuration >= INTERVAL_S) {
      _reportInterval();
      _resetInterval();
    }
  }

  function tickStart(delta: number, elapsedTime: number): void {
    _currentIntervalDuration += delta;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: `StatsHooks("${debugName}")`,

    tickEnd: tickEnd,
    tickStart: tickStart,
  });
}
