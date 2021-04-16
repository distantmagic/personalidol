import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { Scene } from "./Scene.interface";

export type DirectorState = MainLoopUpdatableState & {
  current: null | Scene;
  isStarted: boolean;
  isTransitioning: boolean;
  lastUpdateCurrentTick: number;
  lastUpdateNextTick: number;
  lastUpdateTransitioningTick: number;
  next: null | Scene;
  transitioning: null | Scene;
};
