import type { Scene } from "@personalidol/framework/src/Scene.interface";

export type DirectorState = {
  readonly transitioning: null | Scene;

  current: null | Scene;
  isStarted: boolean;
  isTransitioning: boolean;
  lastUpdateCurrentTick: number;
  lastUpdateNextTick: number;
  lastUpdateTransitioningTick: number;
  next: null | Scene;
};
