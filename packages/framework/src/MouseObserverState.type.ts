import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";

export type MouseObserverState = MainLoopUpdatableState & {
  lastUpdate: number;
};
