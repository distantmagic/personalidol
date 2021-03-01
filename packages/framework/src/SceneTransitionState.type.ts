import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";

export type SceneTransitionState = MainLoopUpdatableState & {
  lastUpdateCurrentTick: number;
  lastUpdateNextTick: number;
  lastUpdateTransitioningTick: number;
};
