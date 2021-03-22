import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";

export type TouchObserverState = MainLoopUpdatableState & {
  lastUpdate: number;
};
