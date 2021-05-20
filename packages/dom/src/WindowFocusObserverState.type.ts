import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";

export type WindowFocusObserverState = MainLoopUpdatableState & {
  isDocumentFocused: boolean;
  isFocusChanged: boolean;
  lastUpdate: number;
};
