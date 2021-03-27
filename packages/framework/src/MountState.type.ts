import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";

export type MountState = MainLoopUpdatableState & {
  isMounted: boolean;
};
