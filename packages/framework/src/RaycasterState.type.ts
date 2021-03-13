import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";

export type RaycasterState = MainLoopUpdatableState & {
  hasIntersections: boolean;
};
