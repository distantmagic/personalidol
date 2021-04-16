import type { MainLoopTickerState } from "./MainLoopTickerState.type";
import type { TickTimerState } from "./TickTimerState.type";

export interface MainLoopTicker {
  state: MainLoopTickerState;
  tickTimerState: TickTimerState;

  tick(delta: number, elapsedTime: number): void;
}
