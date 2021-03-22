import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";

export type KeyboardObserverState = MainLoopUpdatableState & {
  lastUpdate: number;
};
