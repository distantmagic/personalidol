import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";

export type TouchObserverState = MainLoopUpdatableState & {
  lastUpdate: number;
};
