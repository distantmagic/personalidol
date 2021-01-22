import type { TickTimerState } from "./TickTimerState.type";

export type MainLoopUpdateCallback = (delta: number, elapsedTime: number, tickTimerState: TickTimerState) => void;
