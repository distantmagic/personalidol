import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";

export type MountState = MainLoopUpdatableState & {
  isDisposed: boolean;
  isMounted: boolean;
};
