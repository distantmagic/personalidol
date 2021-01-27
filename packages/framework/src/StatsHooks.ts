import { MathUtils } from "three/src/math/MathUtils";

import type { StatsHooks as IStats } from "./StatsHooks.interface";
import type { StatsReportMessage } from "./StatsReportMessage.type";

const INTERVAL_S: number = 1;
// const memory: any = (performance as any).memory;

export function StatsHooks(debugName: string, statsMessagePort: MessagePort): IStats {
  let _currentInterval: number = 0;
  let _currentIntervalDuration: number = 0;
  let _currentIntervalTickAverageTime: number = 0;
  let _currentIntervalTicks: number = 0;
  let _tickDuration: number = 0;
  let _tickEndElapsedTime: number = 0;
  let _tickStartElapsedTime: number = 0;

  function _resetInterval() {
    _currentIntervalDuration = 0;
    _currentIntervalTickAverageTime = -1;
    _currentIntervalTicks = 0;
    _currentInterval += 1;
  }

  function _reportInterval() {
    statsMessagePort.postMessage({
      statsReport: <StatsReportMessage> {
        currentInterval: _currentInterval,
        currentIntervalDuration: _currentIntervalDuration,
        currentIntervalTickAverageTime: _currentIntervalTickAverageTime,
        currentIntervalTicks: _currentIntervalTicks,
        debugName: debugName,
      }
    });
  }

  function tickEnd(elapsedTime: number): void {
    _tickEndElapsedTime = elapsedTime;
    _tickDuration = _tickEndElapsedTime - _tickStartElapsedTime;
    _currentIntervalTicks += 1;

    if (-1 === _currentIntervalTickAverageTime) {
      _currentIntervalTickAverageTime = _tickDuration;
    } else {
      _currentIntervalTickAverageTime += _tickDuration;
      _currentIntervalTickAverageTime /= 2;
    }

    if (_currentIntervalDuration >= INTERVAL_S) {
      _reportInterval();
      _resetInterval();
    }
  }

  function tickStart(delta: number, elapsedTime: number): void {
    _currentIntervalDuration += delta;
    _tickStartElapsedTime = elapsedTime;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: `StatsHooks("${debugName}")`,

    tickEnd: tickEnd,
    tickStart: tickStart,
  });
}
