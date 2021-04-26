import type { MainLoopTickerState } from "./MainLoopTickerState.type";
import type { Nameable } from "./Nameable.interface";
import type { TickTimerState } from "./TickTimerState.type";

export interface MainLoopTicker extends Nameable {
  state: MainLoopTickerState;
  tickTimerState: TickTimerState;

  tick(delta: number, elapsedTime: number): void;
}
