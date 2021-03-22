import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";

export type MouseObserverState = MainLoopUpdatableState & {
  lastUpdate: number;
};
