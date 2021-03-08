import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";

export type WindowFocusObserverState = MainLoopUpdatableState & {
  isDocumentFocused: boolean;
  isFocusChanged: boolean;
  lastUpdate: number;
};
