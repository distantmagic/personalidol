import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";

export type KeyboardObserverState = MainLoopUpdatableState & {
  lastUpdate: number;
};
