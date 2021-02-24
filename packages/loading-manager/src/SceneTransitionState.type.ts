import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";

export type SceneTransitionState = MainLoopUpdatableState & {
  lastUpdateCurrentTick: number;
  lastUpdateNextTick: number;
  lastUpdateTransitioningTick: number;
};
